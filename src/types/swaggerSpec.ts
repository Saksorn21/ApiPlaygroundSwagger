// ---------- Swagger 2.0 / OpenAPI 2.0 Spec ----------
export interface SwaggerSpec {
  swagger: '2.0';
  info: InfoObject;
  host?: string;
  basePath?: string;
  schemes?: ('http' | 'https' | 'ws' | 'wss')[];
  consumes?: string[];
  produces?: string[];
  paths: Record<string, PathItemObject>;
  definitions?: Record<string, SchemaObject>;
  parameters?: Record<string, ParameterObject>;
  responses?: Record<string, ResponseObject>;
  securityDefinitions?: Record<string, SecuritySchemeObject>;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocsObject;
}

// ---------- Info ----------
export interface InfoObject {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
}

export interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

export interface LicenseObject {
  name: string;
  url?: string;
}

// ---------- Paths ----------
export interface PathItemObject {
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  patch?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  parameters?: ParameterObject[];
}

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  consumes?: string[];
  produces?: string[];
  parameters?: ParameterObject[];
  responses: Record<string, ResponseObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
}

// ---------- Parameters ----------
export interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'formData' | 'body';
  description?: string;
  required?: boolean;
  type?: string; // swagger2 uses type directly in parameter
  format?: string;
  schema?: SchemaObject; // for body parameters
  items?: SchemaObject; // for array types
  enum?: string[];
}

// ---------- Responses ----------
export interface ResponseObject {
  description: string;
  schema?: SchemaObject;
  headers?: Record<string, HeaderObject>;
  examples?: Record<string, any>;
}

export interface HeaderObject extends ParameterObject {}

// ---------- Schemas ----------
export interface SchemaObject {
  type?: string;
  format?: string;
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  enum?: string[];
  $ref?: string;
}

// ---------- Security ----------
export interface SecurityRequirementObject {
  [name: string]: string[];
}

export type SecuritySchemeType = 'apiKey' | 'basic' | 'oauth2';

export interface SecuritySchemeObject {
  type: SecuritySchemeType;
  description?: string;
  name?: string; // for apiKey
  in?: 'query' | 'header'; // for apiKey
  flow?: 'implicit' | 'password' | 'application' | 'accessCode'; // for oauth2
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: Record<string, string>;
}

// ---------- Tags ----------
export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocsObject;
}

export interface ExternalDocsObject {
  description?: string;
  url: string;
}
