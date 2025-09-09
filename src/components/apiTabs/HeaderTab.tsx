import React from 'react'
import NoRequire from './NoRequire'

interface HeaderField {
  name: string
  description?: string
  required?: boolean
  schema?: { type?: string }
  in?: string
  authorizationUrl?: string | null
  flow?: string
  type?: string
  scopes?: Record<string, string>
}

interface HeaderTabProps {
  activeTab: string
  headerSchema: any // ผลลัพธ์จาก getHeaderSchema
  headers: Record<string, any>
  setHeaders: React.Dispatch<React.SetStateAction<Record<string, any>>>
  theme: 'dark' | 'light'
  handleInputChange: (
    setFn: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    state: Record<string, any>,
    key: string,
    value: any
  ) => void
}

const HeaderTab: React.FC<HeaderTabProps> = ({
  activeTab,
  headerSchema,
  headers,
  setHeaders,
  theme,
  handleInputChange
}) => {
  if (activeTab !== 'headers') return null
  if (!headerSchema) return <NoRequire title="Headers" theme={theme} />

  // รวม parameters ปกติ + security schemes
  const paramHeaders: HeaderField[] = headerSchema.parameters || []
  const infoHeaders = headerSchema.info || {}

  const securityHeaders: HeaderField[] =
    headerSchema.security?.map((s: any) => ({
      name: s.name,
      type: infoHeaders[s.name]?.type || 'string',
      description: s.scopes?.join(', ') || '',
      required: true,
      in: infoHeaders[s.name]?.in || 'header',
      authorizationUrl: infoHeaders[s.name]?.authorizationUrl || null,
      flow: infoHeaders[s.name]?.flow,
      scopes: infoHeaders[s.name]?.scopes || {}
    })) || []

  const allHeaders = [...paramHeaders, ...securityHeaders]

  // เลือก header หลัก ๆ (แสดง input)
  const mainHeaders = allHeaders.filter(
    (h) =>
      ['Authorization', 'Content-Type', 'Accept'].includes(h.name) || h.required
  )

  return (
    <>
      {mainHeaders.length > 0 ? (
        <div
          className={`border p-2 mb-2 ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
          }`}
        >
          <h4 className="font-bold mb-1 text-shadow-sm">Headers</h4>

          {mainHeaders.map((h) => (
            <div key={h.name} className="mb-2">
              <label className="mr-2 font-semibold text-shadow-sm">
                {h.name} ({h.type}
                {h.flow && ', ' + h.flow})
                {h.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {h.authorizationUrl && (
                <div className="text-xs text-gray-500">
                  Authorization URL:{' '}
                  <a
                    href={h.authorizationUrl}
                    className="ml-1 text-blue-500 hover:underline text-shadow-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {h.authorizationUrl}
                  </a>
                </div>
              )}

              {h.flow && (
                <div className="text-xs text-gray-500">
                  Flow: {h.flow}
                </div>
              )}

              {/* Input field */}
              <input
                type="text"
                value={headers[h.name] || ''}
                placeholder={h.description || ''}
                className={`border rounded px-1 py-0.5 w-full ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-black border-gray-300'
                }`}
                onChange={(e) =>
                  handleInputChange(
                    setHeaders,
                    headers,
                    h.name,
                    e.target.value
                  )
                }
              />

              {/* Scopes */}
              {h.scopes && Object.keys(h.scopes).length > 0 && (
                <div className="mt-1">
                  <div className="text-xs text-gray-500 font-semibold">Scopes:</div>
                  {Object.entries(h.scopes).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-1 text-xs text-gray-500"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        checked={!!headers[key]}
                        onChange={(e) => {
                          const newState = { ...headers, [key]: e.target.checked }

                          // รวม scopes ที่ถูกเลือก
                          const selectedScopes = Object.keys(h.scopes)
                            .filter((s) => newState[s])
                            .join(' ')

                          // อัพเดท Authorization ด้วย
                          newState['Authorization'] = selectedScopes
                            ? `Bearer ${selectedScopes}`
                            : ''

                          setHeaders(newState)
                        }}
                      />
                      <span>
                        {key} - {value}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <NoRequire title="Headers" theme={theme} />
      )}
    </>
  )
}

export default HeaderTab