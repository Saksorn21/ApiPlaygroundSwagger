// utils/getRequestBody.ts
export function getRequestBody(pathItem: any, method: string, spec: any) {
  const operation = pathItem[method.toLowerCase()];
  if (!operation) return null;

  // --- OpenAPI 3.x ---
  if (operation.requestBody) {
    const requestBody = operation.requestBody;
    const content = requestBody.content || {};
    const mediaType = Object.keys(content)[0] || 'application/json';
    const schema = content[mediaType]?.schema;

    return {
      description: requestBody.description || '',
      required: requestBody.required || false,
      mediaType,
      schema,
    };
  }

  // --- Swagger 2.0 ---
  if (operation.parameters) {
    const bodyParam = operation.parameters.find((p: any) => p.in === 'body');
    if (bodyParam) {
      let schema = bodyParam.schema;

      // ถ้า schema อ้างอิง definitions ให้ resolve
      if (schema?.$ref && spec.definitions) {
        schema = getRefSchema(spec, schema.$ref) || schema;
      }

      return {
        description: bodyParam.description || '',
        required: bodyParam.required || false,
        mediaType:
          (operation.consumes && operation.consumes[0]) || 'application/json',
        schema,
        produces: operation.produces || [],
      };
    }
  }

  return null;
}

export function getRefSchema(spec: any, ref: string) {
  const refKey = ref.replace('#/definitions/', '');
  return spec.definitions[refKey];
}
