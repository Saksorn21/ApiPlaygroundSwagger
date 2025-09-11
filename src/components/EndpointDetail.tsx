import React, { useState, useEffect, useMemo } from 'react';
import { ResponseViewer } from './ResponseViewer';
import { DISPLAY_TARGETS } from '../constants';
import BodyTab from './apiTabs/BodyTab';
import NoRequire from './apiTabs/NoRequire';
import HeaderTab from './apiTabs/HeaderTab';
import { Copy, Play, Loader2, Settings } from 'lucide-react';
import { CodeBlock, atomOneDark } from 'react-code-blocks';
import { getRequestBody, getRefSchema, getHeaderSchema } from '../utils';
interface Props {
  spec: any;
  specUrl: string;
  path: string;
  method: string;
  onTry: (
    spec: any,
    specUrl: string,
    method: string,
    path: string,
    params: { query: any; headers: any; body?: any },
  ) => Promise<any>;
  theme?: 'dark' | 'light';
}

export const EndpointDetail: React.FC<Props> = ({
  spec,
  specUrl,
  path,
  method,
  onTry,
  theme = 'light',
}) => {
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  const [params, setParams] = useState<Record<string, any>>({});
  const [headers, setHeaders] = useState<Record<string, any>>({});
  const [bodyParams, setBodyParams] = useState<Record<string, any>>({});
  const [formParams, setFormParams] = useState<{
    query: Record<string, any>;
    headers: Record<string, any>;
    body: Record<string, any>;
  }>({
    query: {},
    headers: {},
    body: {},
  });
  const [response, setResponse] = useState<any>(null);
  const [snippets, setSnippets] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'code' | 'response' | 'params' | 'headers' | 'body'
  >('code');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [contentType, setContentType] = useState<string>('application/json');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };
  const getDefaultValue = (field: any, spec: any): any => {
    // ถ้า field อ้างอิง $ref ให้ดึง schema จริง
    if (field.$ref) {
      const refField = getRefSchema(spec, field.$ref);
      return getDefaultValue(refField, spec);
    }

    // primitive example/default
    if (field.example !== undefined) return field.example;
    if (field.default !== undefined) return field.default;

    // primitive types
    switch (field.type) {
      case 'integer':
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'string':
        return 'string';
    }

    // object
    if (field.type === 'object') {
      const obj: any = {};
      if (field.properties) {
        Object.keys(field.properties).forEach((k) => {
          obj[k] = getDefaultValue(field.properties[k], spec);
        });
      }
      return obj;
    }

    // array
    if (field.type === 'array') {
      if (field.items?.$ref) {
        const ref = getRefSchema(spec, field.items.$ref);
        return [getDefaultValue(ref, spec)];
      } else if (field.items) {
        return [getDefaultValue(field.items, spec)];
      } else {
        return [];
      }
    }

    return null;
  };
  const languageCodeblock = (target: string) => {
    const lan = target.split('_')[0];
    if (lan === 'node') return 'javascript';
    if (lan === 'objc') return 'objectivec';
    return lan;
  };

  const grouped = useMemo(() => {
    return DISPLAY_TARGETS.reduce(
      (acc, item) => {
        acc[item.lang] = acc[item.lang] || [];
        acc[item.lang].push(item);
        return acc;
      },
      {} as Record<string, { lang: string; client: string; target: string }[]>,
    );
  }, []);
  const [arrayItems, setArrayItems] = useState<any[]>([]);

  const handleInputChange = (
    setter: any,
    obj: Record<string, any>,
    name: string,
    value: string | File | undefined,
  ) => {
    setTesting({ obj, name, value });
    setter((prev: any) => ({ ...prev, [name]: value }));
    // if (value instanceof File) {
    //   setBodyParams((prev) =>({...prev, [name]: value.name}))
    // }
    // else{
    //   setBodyParams((prev) =>({...prev, [name]: value}))
    // }
  };

  const handleTry = async () => {
    setTesting({ queryParams, headers, bodyParams, formParams });
    const res = await onTry(spec, specUrl, method, path, {
      query: queryParams,
      headers,
      body: formParams.body,
    });
    setResponse(res.data);
    if (res.snippets) setSnippets(res.snippets);
  };

  const parameters = spec.paths[path][method].parameters || [];
  const queryFields = parameters.filter(
    (p: any) => p.in === 'query' || p.in === 'formData' || p.in === 'path',
  );

  const headerFields = parameters.filter((p: any) => p.in === 'header');
  const headerSchema = getHeaderSchema(spec, path, method);

  const bodyInfo = getRequestBody(spec.paths[path], method, spec);
  const bodySchema = bodyInfo?.schema;
  const firstContentType = bodyInfo?.mediaType || 'application/json';

  // ✅ ตั้ง activeTab อัตโนมัติ

  useEffect(() => {
    const template: Record<string, string> = {};
    DISPLAY_TARGETS.forEach(({ target }) => {
      template[target] =
        `${target} snippet for ${method.toUpperCase()} ${path} (placeholder)`;
    });

    setSnippets(template);
    setSelectedTarget(DISPLAY_TARGETS[0]?.target || '');
    setActiveTab('code');
    setResponse(null);

    setContentType('application/json');
    if (bodySchema?.type === 'object') {
      const initBody: any = {};
      Object.keys(bodySchema.properties).forEach((k) => {
        initBody[k] = getDefaultValue(bodySchema.properties[k], spec);
      });
      setBodyParams(initBody);
    }
  }, [path, method, bodySchema]);

  return (
    <div>
      {/* Endpoint */}
      <h3 className="mb-2 font-bold">
        {method.toUpperCase()} {path}
      </h3>

      {/* Description */}
      {spec.paths[path][method].description && (
        <p className="mb-2">{spec.paths[path][method].description}</p>
      )}
      {testing && JSON.stringify(testing)}
      {/* Try It */}
      <button
        className="mb-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
        onClick={handleTry}
      >
        Try It
      </button>

      {/* Tabs */}
      <div
        className={`mb-2 flex border-b ${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
        }`}
      >
        <button
          className={`px-3 py-1 ${
            activeTab === 'code' ? 'border-b-2 border-blue-600' : ''
          } ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-700 hover:text-black'
          }`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button
          className={`px-3 py-1 ${
            activeTab === 'params' ? 'border-b-2 border-blue-600' : ''
          } ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-700 hover:text-black'
          }`}
          onClick={() => setActiveTab('params')}
        >
          Params {queryFields.length > 0 && `(${queryFields.length})`}
        </button>
        <button
          className={`px-3 py-1 ${
            activeTab === 'headers' ? 'border-b-2 border-blue-600' : ''
          } ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-700 hover:text-black'
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers{' '}
          {headerSchema.security?.length > 0 &&
            `(${headerSchema.security?.length})`}
        </button>
        <button
          className={`px-3 py-1 ${
            activeTab === 'body' ? 'border-b-2 border-blue-600' : ''
          } ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-700 hover:text-black'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Body{' '}
          {bodySchema?.properties.length > 0 &&
            `(${bodySchema?.properties.length})`}
        </button>
        <button
          className={`px-3 py-1 ${
            activeTab === 'response' ? 'border-b-2 border-blue-600' : ''
          } ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white'
              : 'text-gray-700 hover:text-black'
          }`}
          onClick={() => setActiveTab('response')}
        >
          Response
        </button>
      </div>
      <HeaderTab
        activeTab={activeTab}
        headerSchema={headerSchema}
        headers={headers}
        setHeaders={setHeaders}
        theme={theme}
        handleInputChange={handleInputChange}
      />

      {/* Parameters Tab */}
      {activeTab === 'params' && (
        <div>
          {queryFields.length > 0 ? (
            <div
              className={`mb-2 border p-2 ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}
            >
              <h4 className="mb-1 font-bold">Query / Path Parameters</h4>
              {queryFields.map((p: any) => (
                <div key={p.name} className="mb-1">
                  <label className="mr-2 font-semibold">{p.name}</label>
                  <input
                    type={p.type === 'file' ? 'file' : 'text'}
                    value={queryParams[p.name] || ''}
                    placeholder={p.description || ''}
                    className={`rounded border px-1 py-0.5  ${
                      theme === 'dark'
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white text-black'
                    } ${
                      p.type === 'file'
                        ? 'file-input file-input-bordered file-input-sm w-full max-w-xs'
                        : 'text-input text-input-bordered text-input-sm w-full max-w-xs'
                    }`}
                    onChange={(e) =>
                      handleInputChange(
                        setQueryParams,
                        queryParams,
                        p.name,
                        e.target.value,
                      )
                    }
                  />
                  {p.required && <span className="ml-1 text-red-500">*</span>}
                  {p.description && (
                    <p className="mt-1 text-xs text-gray-500">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`mb-2 border p-2 ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}
            >
              <h4 className="mb-1 font-bold">No Query / Path Parameters</h4>
              <p className="text-gray-500">
                This endpoint does not require any query or path parameters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Body Tab */}

      <BodyTab
        body={formParams.body}
        activeTab={activeTab}
        theme={theme}
        bodyInfo={bodyInfo}
        bodySchema={bodySchema}
        spec={spec}
        onChange={(key: string, value: any) =>
          setFormParams((prev) => ({
            ...prev,
            body: { ...prev.body, [key]: value },
          }))
        }
      />

      {/* Code Tab */}
      {activeTab === 'code' && (
        <div className="flex h-[500px] flex-col overflow-hidden">
          <h4 className="mb-1 font-bold">Code Snippets</h4>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className={`mb-2 w-40 rounded border px-1 py-0.5 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
          >
            {Object.entries(grouped).map(([lang, items]) => (
              <optgroup key={lang} label={lang}>
                {items.map(({ client, target }) => (
                  <option key={target} value={target}>
                    {client}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="relative max-w-full flex-1 overflow-auto">
            <div className="relative max-w-full overflow-auto rounded-lg">
              <div style={{ overflowWrap: 'break-word' }}>
                <CodeBlock
                  text={snippets[selectedTarget] || 'No snippet'}
                  language={languageCodeblock(selectedTarget)}
                  theme={atomOneDark}
                  showLineNumbers={false}
                  wrapLongLines={true}
                  customStyle={{
                    fontSize: '0.875rem',
                  }}
                />
              </div>
              <button
                onClick={() => copyCode(snippets[selectedTarget])}
                className="absolute right-4 top-4 rounded-md bg-gray-800 p-2 text-gray-400 hover:text-gray-200"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Tab */}
      {activeTab === 'response' && (
        <ResponseViewer response={response} theme={theme} />
      )}
    </div>
  );
};
