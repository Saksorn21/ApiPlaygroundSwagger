// store/apiSpecStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { ApiSpecState, OpenAPISpec, Operation, ApiSpecActions } from "@/types/openapi"
import { SwaggerSpec} from "@/types/swaggerSpec"

export const useApiSpecStore = create<ApiSpecState & ApiSpecActions>()(
  persist(
    (set) => ({
      // ---------- default state ----------
      rawSpec: null,
      info: null,
      servers: [],
      paths: {},
      operations: {},
      securitySchemes: null,
      selectedOperationId: null,
      auth: { type: "none", token: undefined, scopes: [] },
      request: { params: {}, body: null, headers: {} },
      response: { status: null, data: null, headers: null, error: undefined },
      status: 'idle',
      error: null,

      // ---------- actions ----------
      setRawSpec: (spec) =>
        set(() => {
          const info = spec.info ?? null;
          const servers = (spec?.servers ?? []).map((s) => s.url);
          const operations: Record<string, Operation> = {};

          Object.entries(spec.paths ?? {}).forEach(([path, pathItem]) => {
            Object.entries(pathItem).forEach(([method, op]: [string, any]) => {
              if (["get", "post", "put", "delete", "patch"].includes(method)) {
                const operationId = op.operationId || `${method}_${path}`;
                operations[operationId] = {
                  operationId,
                  method,
                  path,
                  summary: op.summary,
                  parameters: op.parameters,
                  requestBody: op.requestBody,
                  responses: op.responses,
                };
              }
            });
          });

          return {
            rawSpec: spec,
            info,
            servers,
            operations,
            paths: {},
            securitySchemes: spec.components?.securitySchemes ?? null,
          };
        }),

      reloadSpec: (newSpec) =>
        set((state) => {
          const oldAuth = state.auth;
          const oldHeaders = state.request.headers;
            if ('openapi' in newSpec || 'swagger' in newSpec) {

          const operations: Record<string, Operation> = {};
          Object.entries(newSpec.paths ?? {}).forEach(([path, pathItem]) => {
            Object.entries(pathItem).forEach(([method, op]: [string, any]) => {
              if (["get", "post", "put", "delete", "patch"].includes(method)) {
                const operationId = op.operationId || `${method}_${path}`;
                operations[operationId] = {
                  operationId,
                  method,
                  path,
                  summary: op.summary,
                  parameters: op.parameters,
                  requestBody: op.requestBody,
                  responses: op.responses,
                };
              }
            });
          });
            

          return {
            rawSpec: newSpec,
            info: newSpec.info ?? null,
            servers: (newSpec.servers ?? []).map((s) => s.url),
            operations,
            securitySchemes: newSpec.components?.securitySchemes ?? null,
            auth: oldAuth,
            request: { ...state.request, headers: oldHeaders },
            status: 'reloaded',
            error: null
          };
          }else{
            return {
              ...state,
              status: 'error',
              error: 'Invalid spec format - must be OpenAPI 3.x or Swagger 2.x'
            }
          }
        }),

      selectOperation: (operationId) =>
        set(() => ({
          selectedOperationId: operationId,
          request: { params: {}, body: null, headers: {} },
          response: { status: null, data: null, headers: null, error: undefined },
        })),

      setAuth: (auth) => set(() => ({ auth })),
      setRequest: (req) =>
        set((state) => ({ request: { ...state.request, ...req } })),
      setResponse: (res) =>
        set((state) => ({ response: { ...state.response, ...res } })),
      reset: () =>
        set(() => ({
          rawSpec: null,
          info: null,
          servers: [],
          paths: {},
          operations: {},
          securitySchemes: null,
          selectedOperationId: null,
          auth: { type: "none", token: undefined, scopes: [] },
          request: { params: {}, body: null, headers: {} },
          response: { status: null, data: null, headers: null, error: undefined },
          status: 'idle',
          error: null
        })),
    }),
    {
      name: "api-spec-storage",
      getStorage: () => localforage,
      partialize: (state) => ({
        rawSpec: state.rawSpec,
        info: state.info,
        servers: state.servers,
        operations: state.operations,
        securitySchemes: state.securitySchemes,
        selectedOperationId: state.selectedOperationId,
        auth: state.auth,
        request: state.request,
        status: state.status,
        error: state.error
      }),
    }
  )
);


export const reloadSpec = async (newSpec: OpenAPISpec) => {
  const store = useApiSpecStore.getState()

  // เก็บค่าเดิมบางส่วนไว้
  const oldAuth = store.auth
  const oldRequestHeaders = store.request.headers

  // สร้าง operations ใหม่จาก spec ใหม่
    if ('openapi' in newSpec || 'swagger' in newSpec) {
  const operations: Record<string, Operation> = {}
  Object.entries(newSpec.paths ?? {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, op]: [string, any]) => {
      if (["get", "post", "put", "delete", "patch"].includes(method)) {
        const operationId = op.operationId || `${method}_${path}`
        operations[operationId] = {
          operationId,
          method,
          path,
          summary: op.summary,
          parameters: op.parameters,
          requestBody: op.requestBody,
          responses: op.responses,
        }
      }
    })
  })
   
  // อัปเดต store โดย merge กับค่าเดิมบางส่วน
  useApiSpecStore.setState({
    rawSpec: newSpec,
    info: newSpec.info ?? null,
    servers: (newSpec.servers ?? []).map((s) => s.url),
    operations,
    securitySchemes: newSpec.components?.securitySchemes ?? null,
    auth: oldAuth, // เก็บ auth เดิม
    request: { ...store.request, headers: oldRequestHeaders }, // เก็บ headers เดิม
    status: 'reloaded',
    error: null
  })
    }else{
      useApiSpecStore.setState({
        ...store,
        status: 'error',
        error: 'Invalid spec format - must be OpenAPI 3.x or Swagger 2.x'
        
      })
    }
}