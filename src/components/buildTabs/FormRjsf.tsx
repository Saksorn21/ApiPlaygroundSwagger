import Form from '@rjsf/shadcn'
import { ObjectFieldTemplate } from '@/components/rjsf/ObjectField'
import { OpenAPISpec, SwaggerSpec } from '@/types/openapi'
import { JsonEditor } from 'json-edit-react'
import { SchemaTypeMap } from '@/utils/formSchema'
import uiSchema from '@/utils/uiSchema'
import validator from '@rjsf/validator-ajv8'
import  { FC, useEffect, useState, useRef } from 'react'

interface FormRjsfProps {
  spec: OpenAPISpec | SwaggerSpec | null
  activeTab: 'info' | 'paths' | 'components' | 'preview'
  handleFormChange: (e: any) => void
  onError: (e: any) => void
}

const FormRjsf: FC<FormRjsfProps> = ({ spec, activeTab, handleFormChange, onError }) =>{
  const [formData, setFormData] = useState<any>(null)
  const formRef = useRef<any>(null)
  useEffect(() => {
    if (spec) {
      setFormData(spec)
    }
  })
  const schema = SchemaTypeMap(spec, activeTab)
  console.log(schema)
  return (
    <>
      { activeTab !== 'preview' &&
      <Form 
        schema={SchemaTypeMap(spec, activeTab)}
        uiSchema={uiSchema}
        validator={validator}
        onChange={handleFormChange}
        onError={onError}
        formData={spec}
        templates={{
          ObjectFieldTemplate
        }}
        //ref={formRef}
        />
        }
      { activeTab === 'preview' && 
        <JsonEditor data={formData}
          />
      }
    </>
  )

}
export default FormRjsf