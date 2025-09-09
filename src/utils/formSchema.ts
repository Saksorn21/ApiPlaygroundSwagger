import { OpenAPISpec } from "@/types/openapi"
import { SwaggerSpec } from '@/types/swaggerSpec'
import { JSONSchema7 } from "json-schema"
  import { RJSFSchema } from '@rjsf/utils';
import { chackSpecVersion } from '.'

export const SchemaInfoTypeMap = (spec: OpenAPISpec | SwaggerSpec): RJSFSchema => {
  let schemaType: RJSFSchema = {}
  if (chackSpecVersion(spec) === "openapi3"){
    schemaType = {
        type: "object",
        properties: {
          info: {
            type: "object",
            properties: {
              title: { type: "string" },
              version: { type: "string" },
              description: { type: "string" },
              termsOfService: { type: "string", title: "Terms of Service"},
              contact:{
                type: "object",
                properties:{
                  name: { type: "string", title: "Contact Name"},
                  url: { type: "string", title: "Contact URL"},
                  email: { type: "string", title: "Contact Email"}
                }
              },
              license:{
                type: "object",
                properties: {
                  name: { type: "string", title: "Contact Name"},
                  url: { type: "string", title: "Contact URL"},
                }
              }
            },
          },
          servers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                url: { type: "string", title: "Server URL" },
                description: { type: "string", title: "Description" },
              },
              required: ["url"],
            },
          },
          tags: {
            type: "array",
            items:{
            type: "object",
              properties: {
                name: { type: "string", title: "Tag Name", },
                description: { type: "string", title: "Tag description"}
              }
            }
          },
        },
      }
  }else if (chackSpecVersion(spec) === "swagger"){
    schemaType = {
      type: "object",
      properties: {
        info: {
          type: "object",
          properties: {
            title: { type: "string" },
            version: { type: "string" },
            description: { type: "string" },
            termsOfService: { type: "string", title: "Terms of Service"},
            contact:{
              type: "object",
              properties:{
                name: { type: "string", title: "Contact Name"},
                url: { type: "string", title: "Contact URL"},
                email: { type: "string", title: "Contact Email"}
              }
            },
            license:{
              type: "object",
              properties: {
                name: { type: "string", title: "Contact Name"},
                url: { type: "string", title: "Contact URL"},
              }
            }
          },
        },
        host: { type: "string", title: "Host"},
        basePath: { type: "string", title: "Base Path"},
        tags: {
          type: "array",
          items:{
          type: "object",
            properties: {
              name: { type: "string", title: "Tag Name", },
              description: { type: "string", title: "Tag description"}
            }
          }
        },
        schemes: {
          type: "array",
          items: {
            type: "string",
            enum: ["http", "https", "ws", "wss"]
          }
        },
        
      },
    }
    
  }
  return schemaType
}


const operationKeys = [
  "get", "post", "put", "delete", "patch",
  "options", "head", "trace"
];

// --- Operation object สำหรับ Swagger 2.0 ---
const operationObjectSwagger2: RJSFSchema = {
  type: "object",
  properties: {
    tags: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    description: { type: "string" },
    operationId: { type: "string" },
    deprecated: { type: "boolean" },
    security: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    parameters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          in: { type: "string", enum: ["query", "header", "path", "cookie", "body"] },
          description: { type: "string" },
          required: { type: "boolean" },
          schema: { type: "object" } // ตรงนี้ยังขยายได้อีกเยอะ
        },
        required: ["name", "in"]
      }
    },
    responses: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                    properties: {
                      description: { type: "string" },
                      schema: { type: "object" }, // ✅ Swagger 2.0 ใช้ schema ตรงนี้
                      headers: { type: "object" },
                      examples: { type: "object" }
              }
            }
          }
  
      
    
  }
};

// --- Operation object สำหรับ OpenAPI 3.x ---
const operationObjectOAS3: RJSFSchema = {
  type: "object",
  properties: {
    tags: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    description: { type: "string" },
    operationId: { type: "string" },
    deprecated: { type: "boolean" },
    security: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    parameters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          in: { type: "string", enum: ["query", "header", "path", "cookie", "body"] },
          description: { type: "string" },
          required: { type: "boolean" },
          schema: { type: "object" } // ตรงนี้ยังขยายได้อีกเยอะ
        },
        required: ["name", "in"]
      }
    },
    requestBody: {
      type: "object",
      properties: {
        description: { type: "string" },
        required: { type: "boolean" },
        content: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              schema: { type: "object" }
            }
          }
        }
      }
    }, // ✅ มีเฉพาะ OAS3
    responses: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          description: { type: "string" },
          headers: { type: "object" },
          content: {
            type: "object",
            additionalProperties: {
              type: "object",
              properties: {
                schema: { type: "object" }
              }
            }
          }
        }
      }
    }
  }
};

export const SchemaPathsTypeMap = (spec: OpenAPISpec | SwaggerSpec): RJSFSchema => {
  const version = chackSpecVersion(spec); // คืนค่า "openapi3" หรือ "swagger"
  let schemaType: RJSFSchema = {};

  if (version === "swagger") {
    // Swagger 2.0
    schemaType = {
      type: "object",
      properties: {
        paths: {
          type: "object",
          additionalProperties: {
            type: "object", // PathItemObject
            propertyNames: { enum: [...operationKeys, "parameters"] },
            additionalProperties: operationObjectSwagger2
          }
        }
      }
    };
  } else if (version === "openapi3") {
    // OpenAPI 3.x
    schemaType = {
      type: "object",
      properties: {
        paths: {
          type: "object",
          additionalProperties: {
            type: "object", // PathItemObject
            propertyNames: { enum: [...operationKeys, "parameters"] },
            additionalProperties: operationObjectOAS3
          }
        }
      }
    };
  }

  return schemaType;
};