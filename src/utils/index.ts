export * from './getRequestBody';

export const getBaseUrlFromSpec = (spec: any, specUrl: string) => {
  if (spec.swagger && spec.swagger.startsWith('2.')) {
    // Swagger v2
    const scheme =
      spec.schemes?.[0] || (specUrl.startsWith('https') ? 'https' : 'http');
    const host = spec.host || new URL(specUrl).host;
    const basePath = spec.basePath || '';
    return `${scheme}://${host}${basePath}`;
  } else if (spec.openapi && spec.openapi.startsWith('3.')) {
    // OpenAPI 3
    if (spec.servers && spec.servers.length > 0) {
      return spec.servers[0].url;
    } else {
      return new URL(specUrl).origin;
    }
  }
  // fallback
  return new URL(specUrl).origin;
};
export const chackSpecVersion = (spec: any): string => {
  if (!spec) return 'unknown';
  let version: string = spec.swagger || spec.openapi;
  // ^3\\.0\\.\\d(-.+)?$
  const versionRegex = /^3\\.0\\.\\d(-.+)?$/;
  
  if (version && version.startsWith('2.0')) {
    version = 'swagger';
  } else if (version && version.startsWith("3.0")) {
    version = 'openapi3';
  } else if (version && version.startsWith("3.1")) {
    version = 'openapi31'
  }
  return version;
};
// resolve $ref ใน spec
export const resolveRef = (spec: any, ref: string): any => {
  if (!ref.startsWith('#/')) return null;

  const parts = ref.replace(/^#\//, '').split('/');
  let result: any = spec;
  for (const p of parts) {
    result = result?.[p];
    if (!result) break;
  }
  return result || null;
};
export const extractSchema = (spec: any, schemaOrRef: any): any => {
  if (!schemaOrRef) return null;

  // case: $ref
  if (schemaOrRef.$ref) {
    return resolveRef(spec, schemaOrRef.$ref);
  }

  // case: schema ตรงๆ
  return schemaOrRef;
};
export const getHeaderSchema = (spec: any, path: string, method: string) => {
  const header: any = {
    info: {},
    parameters: [],
    security: [],
  };

  const op = spec.paths?.[path]?.[method];
  if (!op) return null;

  const specVersion = chackSpecVersion(spec); // 'swagger' | 'openapi3'

  if (specVersion === 'swagger') {
    // Swagger 2.0
    const secDefs = spec.securityDefinitions || {};
    header.info = Object.fromEntries(
      Object.entries(secDefs).map(([key, val]) => [
        key,
        extractSchema(spec, val),
      ]),
    );

    header.parameters =
      op.parameters?.filter((p: any) => p.in === 'header') || [];

    if (op.security && Array.isArray(op.security)) {
      header.security = op.security.map((secObj: any) => {
        const key = Object.keys(secObj)[0];
        return {
          name: key,
          scopes: secObj[key],
          scheme: header.info[key] || null, // resolve ref if needed
        };
      });
    }
  } else if (specVersion === 'openapi3') {
    // OpenAPI 3.0
    const secSchemes = spec.components?.securitySchemes || {};
    header.info = Object.fromEntries(
      Object.entries(secSchemes).map(([key, val]) => [
        key,
        extractSchema(spec, val),
      ]),
    );

    header.parameters =
      op.parameters?.filter((p: any) => p.in === 'header') || [];

    const securityArr = op.security || spec.security || [];
    if (securityArr.length > 0) {
      header.security = securityArr.map((secObj: any) => {
        const key = Object.keys(secObj)[0];
        return {
          name: key,
          scopes: secObj[key],
          scheme: header.info[key] || null,
        };
      });
    }
  }

  return header;
};
// ✅ ดึง requestBody (openapi3) หรือ parameters (swagger2)
export const getRequestSchema = (
  spec: any,
  path: string,
  method: string,
): any => {
  const op = spec.paths?.[path]?.[method];
  if (!op) return null;

  if (spec.openapi?.startsWith('3.')) {
    // OpenAPI3 -> requestBody
    const content = op.requestBody?.content;
    if (content) {
      const json = content['application/json'];
      if (json?.schema) return extractSchema(spec, json.schema);
    }
  } else if (spec.swagger?.startsWith('2.')) {
    // Swagger2 -> parameters
    const bodyParam = op.parameters?.find((p: any) => p.in === 'body');
    if (bodyParam?.schema) return extractSchema(spec, bodyParam.schema);
  }

  return null;
};

// ✅ ดึง response schema
export const getResponseSchema = (
  spec: any,
  path: string,
  method: string,
  status: string,
) => {
  const operation = spec.paths?.[path]?.[method.toLowerCase()];
  if (!operation) return null;

  // Swagger v2
  if (spec.swagger === '2.0') {
    const schema = operation.responses?.[status]?.schema;
    return parseSchema(spec, schema);
  }

  // OpenAPI v3
  if (spec.openapi?.startsWith('3.')) {
    const schema =
      operation.responses?.[status]?.content?.['application/json']?.schema;
    return parseSchema(spec, schema);
  }

  return null;
};
export const parseSchema = (spec: any, schema: any): any => {
  if (!schema) return null;

  // ถ้าเป็น $ref ต้อง resolve
  if (schema.$ref) {
    const refPath = schema.$ref.replace(/^#\//, '').split('/');
    let resolved = spec;
    for (const key of refPath) {
      resolved = resolved?.[key];
    }
    return parseSchema(spec, resolved); // recursive
  }

  // ถ้าเป็น type ปกติ
  if (schema.type === 'object' && schema.properties) {
    const props: any = {};
    for (const [key, val] of Object.entries(schema.properties)) {
      props[key] = parseSchema(spec, val);
    }
    return { type: 'object', properties: props };
  }

  if (schema.type === 'array' && schema.items) {
    return {
      type: 'array',
      items: parseSchema(spec, schema.items),
    };
  }

  // primitive
  return { type: schema.type, format: schema.format };
};

export const getRequestBodySchema = (
  spec: any,
  path: string,
  method: string,
) => {
  const operation = spec.paths?.[path]?.[method.toLowerCase()];
  if (!operation) return null;

  // Swagger v2 → in: body
  if (spec.swagger === '2.0') {
    const param = operation.parameters?.find((p: any) => p.in === 'body');
    return parseSchema(spec, param?.schema);
  }

  // OpenAPI v3 → requestBody
  if (spec.openapi?.startsWith('3.')) {
    const schema = operation.requestBody?.content?.['application/json']?.schema;
    return parseSchema(spec, schema);
  }

  return null;
};
