export const defaultApiSpecState: ApiSpecState = {
  rawSpec: null,
  info: null,
  servers: [],
  paths: {},
  operations: {},
  securitySchemes: null,
  selectedOperationId: null,
  auth: {
    type: "none",
    token: undefined,
    scopes: [],
  },
  request: {
    params: {},
    body: null,
    headers: {},
  },
  response: {
    status: null,
    data: null,
    headers: null,
    error: undefined,
  },
};