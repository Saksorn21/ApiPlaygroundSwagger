import { OpenAPISpec } from "@/types/openapi";

export const defaultSpec: OpenAPISpec = {
  openapi: "3.0.3",
  info: {
    title: "New API",
    version: "1.0.0",
    description: "Generated with API Playground",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  paths: {
    "/example": {
      get: {
        summary: "Get example resource",
        description: "Retrieve a list of example items.",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Example: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
        required: ["id", "name"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "example",
      description: "Operations related to example resources",
    },
  ],
};