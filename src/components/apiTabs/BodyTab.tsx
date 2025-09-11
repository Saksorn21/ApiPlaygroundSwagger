import React, { useState } from 'react';
import { CodeBlock, atomOneDark } from 'react-code-blocks';
import { Copy } from 'lucide-react';
import NoRequire from './NoRequire';
interface BodyTabProps {
  body: any;
  activeTab: string;
  theme: 'light' | 'dark';
  bodyInfo: any;
  bodySchema: any;
  spec: any;
  onChange: (key: string, value: any) => void;
}

const BodyTab: React.FC<BodyTabProps> = ({
  body,
  activeTab,
  theme,
  bodyInfo,
  bodySchema,
  spec,
  onChange,
}) => {
  const [bodyParams, setBodyParams] = useState<any>({});
  const [contentType, setContentType] = useState<string>(
    bodyInfo?.produces?.[0] || 'application/json',
  );

  const getRefSchema = (spec: any, $ref: string) => {
    const path = $ref.replace('#/', '').split('/');
    return path.reduce((acc: any, key: string) => acc[key], spec);
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

  if (activeTab !== 'body') return null;

  const handleValueChange = (name: string, value: any) => {
    onChange(name, value);
  };

  const previewJson = (() => {
    if (Object.keys(body).length === 0) {
      if (bodySchema?.example) return bodySchema.example;
      if (bodySchema?.default) return bodySchema.default;
      if (bodySchema?.type === 'object' && bodySchema.properties) {
        const obj: any = {};
        Object.keys(bodySchema.properties).forEach((k) => {
          const p = bodySchema.properties[k];
          if (p.type === 'array') {
            if (p.items?.$ref)
              obj[k] = [
                getDefaultValue(getRefSchema(spec, p.items.$ref), spec),
              ];
            else obj[k] = [p.items?.example ?? ''];
          } else if (p.$ref) {
            obj[k] = getDefaultValue(getRefSchema(spec, p.$ref), spec);
          } else obj[k] = p.example ?? p.default ?? '';
        });
        return obj;
      }
      return {};
    }
    return body;
  })();

  return (
    <div>
      {bodyInfo ? (
        <div
          className={`mb-2 rounded border p-2 ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <h4 className="mb-2 font-bold">Request Body</h4>

          {/* Content-Type */}
          <p className="mb-2 text-xs text-gray-500">
            Content-Type:{' '}
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={`mb-2 w-40 rounded border px-1 py-0.5 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-black'
              }`}
            >
              {bodyInfo?.produces?.map((ct: string) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </p>

          {/* Input fields */}
          {bodySchema?.type === 'object' && bodySchema.properties ? (
            <>
              {Object.keys(bodySchema.properties).map((fieldName) => {
                const field = bodySchema.properties[fieldName];
                const required = (bodySchema.required || []).includes(
                  fieldName,
                );
                const isArray = field.type === 'array';
                let fieldRef: any = null;

                // array ของ object
                if (isArray && field.items?.$ref) {
                  fieldRef = getRefSchema(spec, field.items.$ref);
                }

                return (
                  <div key={fieldName} className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">
                      {fieldName}{' '}
                      {required && <span className="ml-1 text-red-500">*</span>}
                    </label>

                    {/* array ของ primitive */}
                    {isArray && !fieldRef ? (
                      <div className="space-y-1">
                        {(body[fieldName] || [field.items?.example ?? '']).map(
                          (v: string, idx: number) => (
                            <input
                              key={idx}
                              type={
                                field.items.type === 'number'
                                  ? 'number'
                                  : 'text'
                              }
                              value={v}
                              placeholder={`Enter ${fieldName}[${idx}]`}
                              className={`w-full rounded border px-2 py-1 text-sm ${
                                theme === 'dark'
                                  ? 'border-gray-600 bg-gray-700 text-white'
                                  : 'border-gray-300 bg-white text-black'
                              }`}
                              onChange={(e) => {
                                const arr = [...(body[fieldName] || [])];
                                arr[idx] = e.target.value;
                                handleValueChange(fieldName, arr);
                              }}
                            />
                          ),
                        )}
                        <button
                          type="button"
                          className="text-xs text-blue-600"
                          onClick={() => {
                            const arr = [...(body[fieldName] || []), ''];
                            handleValueChange(fieldName, arr);
                          }}
                        >
                          + Add item
                        </button>
                      </div>
                    ) : fieldRef ? (
                      // array ของ object
                      <div className="space-y-2 rounded border p-2">
                        {(
                          body[fieldName] || [getDefaultValue(fieldRef, spec)]
                        ).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="space-y-1 rounded border p-2"
                          >
                            <span className="text-xs text-gray-500">
                              {fieldRef.type}
                            </span>
                            {Object.keys(fieldRef.properties).map((k) => {
                              const f = fieldRef.properties[k];
                              return (
                                <input
                                  key={k}
                                  type={f.type === 'number' ? 'number' : 'text'}
                                  value={item[k]}
                                  placeholder={`Enter ${k}`}
                                  className={`w-full rounded border px-2 py-1 text-sm ${
                                    theme === 'dark'
                                      ? 'border-gray-600 bg-gray-700 text-white'
                                      : 'border-gray-300 bg-white text-black'
                                  }`}
                                  onChange={(e) => {
                                    const arr = [...(body[fieldName] || [])];
                                    arr[idx] = {
                                      ...arr[idx],
                                      [k]: e.target.value,
                                    };
                                    handleValueChange(fieldName, arr);
                                  }}
                                />
                              );
                            })}
                            <button
                              type="button"
                              className="text-xs text-red-600"
                              onClick={() => {
                                const arr = [...(body[fieldName] || [])];
                                arr.splice(idx, 1);
                                handleValueChange(fieldName, arr);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-xs text-blue-600"
                          onClick={() => {
                            const arr = [
                              ...(body[fieldName] || []),
                              getDefaultValue(fieldRef, spec),
                            ];
                            handleValueChange(fieldName, arr);
                          }}
                        >
                          + Add item
                        </button>
                      </div>
                    ) : (
                      // primitive / object ปกติ
                      <input
                        type={
                          field.type === 'integer' || field.type === 'number'
                            ? 'number'
                            : 'text'
                        }
                        value={
                          body[fieldName] ??
                          field.example ??
                          field.default ??
                          ''
                        }
                        placeholder={field.description || `Enter ${fieldName}`}
                        className={`w-full rounded border px-2 py-1 text-sm ${
                          theme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-black'
                        }`}
                        onChange={(e) =>
                          handleValueChange(fieldName, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </>
          ) : null}

          {/* Preview JSON */}
          <div
            className={`mt-4 flex flex-col overflow-hidden rounded border p-2 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900 text-gray-200'
                : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            <h5 className="mb-1 text-sm font-semibold">Preview JSON</h5>
            <div className="relative max-w-full flex-1 overflow-auto">
              <div className="relative max-w-full overflow-auto rounded-lg">
                <div style={{ overflowWrap: 'break-word' }}>
                  <CodeBlock
                    text={JSON.stringify(
                      previewJson,
                      (key, value) =>
                        value instanceof File ? value.name : value,
                      2,
                    )}
                    language="json"
                    theme={atomOneDark}
                    showLineNumbers={false}
                  />
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(previewJson, null, 2),
                    )
                  }
                  className="absolute right-4 top-1 rounded-md bg-gray-800 p-2 text-gray-400 hover:text-gray-200"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoRequire title="Body" theme={theme} />
      )}
    </div>
  );
};
export default BodyTab;
