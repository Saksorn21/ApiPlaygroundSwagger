export const MOCKSPEC = {
  paths: {
    "/pet": {
      "post": {
        summary: "Add a new pet to the store",
        description: "Add a new pet to the store",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  status: { type: "string" }
                }
              }
            }
          }
        }
      },
      "get": {
        summary: "Find pets by status",
        description: "Multiple status values can be provided",
        parameters: [
          { name: "status", in: "query", description: "Status values" }
        ]
      }
    },
    "/pet/{petId}": {
      "get": {
        summary: "Find pet by ID",
        description: "Returns a single pet",
        parameters: [
          { name: "petId", in: "path", description: "ID of pet to return" }
        ]
      },
      "delete": {
        summary: "Deletes a pet",
        description: "Delete a pet",
        parameters: [
          { name: "petId", in: "path", description: "Pet id to delete" }
        ]
      }
    },
    "/store/order": {
      "post": {
        summary: "Place an order for a pet",
        description: "Place a new order in the store",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  id: { type: "integer" },
                  petId: { type: "integer" },
                  quantity: { type: "integer" },
                  status: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    "/user": {
      "post": {
        summary: "Create user",
        description: "This can only be done by the logged in user",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  id: { type: "integer" },
                  username: { type: "string" },
                  email: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  }
} as const
export const DISPLAY_TARGETS = [
    { lang: "JavaScript", client: "Axios",       target: "javascript_axios" },
    { lang: "JavaScript", client: "Fetch",       target: "javascript_fetch" },
    { lang: "JavaScript", client: "XHR",         target: "javascript_xhr" },
    { lang: "JavaScript", client: "jQuery",      target: "javascript_jquery" },
    { lang: "Node.js",    client: "fetch",       target: "node_fetch" },
    { lang: "Node.js",    client: "request",     target: "node_request" },
    { lang: "Node.js",    client: "unirest",     target: "node_unirest" },
    { lang: "Python",     client: "requests",    target: "python_requests" },
    { lang: "Python",     client: "python3",     target: "python_python3" },
    { lang: "Java",       client: "OkHttp",      target: "java_okhttp" },
    { lang: "Java",       client: "Unirest",     target: "java_unirest" },
    { lang: "C#",         client: "HttpClient",  target: "csharp_httpclient" },
    { lang: "C#",         client: "RestSharp",   target: "csharp_restsharp" },
    { lang: "Go",         client: "native",      target: "go_native" },
    { lang: "PHP",        client: "cURL",        target: "php_curl" },
    { lang: "PHP",        client: "http v1",     target: "php_http1" },
    { lang: "PHP",        client: "http v2",     target: "php_http2" },
    { lang: "Objective-C",client: "NSURLSession",target: "objc_nsurlsession" },
    { lang: "Swift",      client: "NSURLSession",target: "swift_nsurlsession" },
    { lang: "Ruby",       client: "native",      target: "ruby_native" },
    { lang: "C",          client: "libcurl",     target: "c_libcurl" },
    { lang: "OCaml",      client: "cohttp",      target: "ocaml_cohttp" },
    { lang: "Shell",      client: "cURL",        target: "shell_curl" },
    { lang: "Shell",      client: "HTTPie",      target: "shell_httpie" },
    { lang: "Shell",      client: "wget",        target: "shell_wget" },
  ] as const
