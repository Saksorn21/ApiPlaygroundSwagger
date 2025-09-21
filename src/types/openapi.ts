// types/openapi.ts
import { SwaggerSpec as SwaggerSpec2 } from './swaggerSpec';
import { OpenAPI,OpenAPIV3 , OpenAPIV2  } from 'openapi-types'
// ---------- OpenAPI 3.x Spec ----------
export interface OpenAPISpec extends OpenAPIV3.Document {
  openapi: string; // e.g. "3.0.3"
  info: InfoObject;
  servers?: ServerObject[];
  paths: Record<string, PathItemObject>;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
}

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

// ---------- Server ----------
export interface ServerObject {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariableObject>;
}

export interface ServerVariableObject {
  default: string;
  enum?: string[];
  description?: string;
}

// ---------- Paths ----------
export interface PathItemObject {
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  patch?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  trace?: OperationObject;
  parameters?: ParameterObject[];
}

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: Record<string, ResponseObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
}

// ---------- Parameters ----------
export interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: SchemaObject;
}

// ---------- Request Body ----------
export interface RequestBodyObject {
  description?: string;
  required?: boolean;
  content: Record<string, MediaTypeObject>;
}

export interface MediaTypeObject {
  schema?: SchemaObject;
  example?: any;
  examples?: Record<string, ExampleObject>;
}

export interface ExampleObject {
  summary?: string;
  value?: any;
}

// ---------- Responses ----------
export interface ResponseObject {
  description: string;
  headers?: Record<string, HeaderObject>;
  content?: Record<string, MediaTypeObject>;
}

export interface HeaderObject extends ParameterObject {}

// ---------- Components ----------
export interface ComponentsObject {
  schemas?: Record<string, SchemaObject>;
  responses?: Record<string, ResponseObject>;
  parameters?: Record<string, ParameterObject>;
  requestBodies?: Record<string, RequestBodyObject>;
  securitySchemes?: Record<string, SecuritySchemeObject>;
}

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

export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';

export interface SecuritySchemeObject {
  type: SecuritySchemeType;
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

export interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

export interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
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

// ---------- Simplified State ----------
export interface ApiSpecState {
  rawSpec: OpenAPISpec | SwaggerSpec | null;
  info: InfoObject | null;
  servers: string[];
  paths: Record<string, PathItem>;
  operations: Record<string, Operation>; // keyed by operationId
  securitySchemes: Record<string, SecurityScheme> | null;
  selectedOperationId: string | null;

  auth: {
    type: 'none' | 'apiKey' | 'oauth2' | 'basic';
    token?: string;
    scopes?: string[];
  };
  request: {
    params: Record<string, any>;
    body: any;
    headers: Record<string, string>;
  };
  response: {
    status: number | null;
    data: any;
    headers: Record<string, string> | null;
    error?: string;
  };
  status: 'idle' | 'loading' | 'success' | 'error' | 'reloaded';
  error: string | null;
}

export interface ApiSpecActions {
  setRawSpec: (spec: OpenAPISpec | SwaggerSpec) => void;
  reloadSpec: (newSpec: OpenAPISpec | SwaggerSpec) => void;
  selectOperation: (operationId: string) => void;
  setAuth: (auth: ApiSpecState['auth']) => void;
  setRequest: (req: Partial<ApiSpecState['request']>) => void;
  setResponse: (res: Partial<ApiSpecState['response']>) => void;
  reset: () => void;
}

// Simplified
export interface PathItem {
  summary?: string;
  description?: string;
  operations: Record<string, Operation>;
}

export interface Operation {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required: boolean;
  schema?: any;
}

export interface RequestBody {
  content: Record<string, { schema: any }>;
}

export interface Response {
  description: string;
  content?: Record<string, { schema: any }>;
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  name?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: any;
}
export type SwaggerSpec = SwaggerSpec2 = OpenAPIV2.Document