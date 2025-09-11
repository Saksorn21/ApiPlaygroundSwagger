import { SwaggerSpec } from '@/types/swaggerSpec';
export const defaultSwagger2Spec: SwaggerSpec = {
  swagger: '2.0',
  info: {
    title: '',
    description: '',
    version: '1.0.0',
  },
  host: '',
  basePath: '/',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {},
  definitions: {},
  parameters: {},
  responses: {},
  securityDefinitions: {},
  security: [],
  tags: [],
  externalDocs: { url: '' },
};
