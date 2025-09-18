import {
  buttonId,
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  titleId,
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplateProps,
} from "@rjsf/utils"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Plus } from 'lucide-react'
export function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    description,
      title,
      properties,
      required,
      uiSchema,
      idSchema,
      schema,
      formData,
      onAddClick,
      disabled,
      readonly,
      registry,
  } = props

  const options = getUiOptions<T, S, F>(uiSchema)
  
  const TitleFieldTemplate = getTemplate<
    "TitleFieldTemplate",
    T,
    S,
    F
  >("TitleFieldTemplate", registry, options)

  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options)
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  
  
  return (
    <div >
      {/* Title */}
      {title && (
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}

      {/* Description */}
      {description && (
        <DescriptionFieldTemplate
          id={idSchema.$id}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}

      {/* Properties → Render as Accordion */}
      <Accordion type="multiple" className="w-full space-y-2">
        {properties.map((prop: ObjectFieldTemplatePropertyType) => {


      return(
      
          <AccordionItem key={prop.name } value={prop.name}>
            <AccordionTrigger>{prop.name}
           </AccordionTrigger>
            <AccordionContent >
              {prop.content}
            </AccordionContent>
          </AccordionItem>
        )})}
        {canExpand(schema, uiSchema, formData) ? (
          <AddButton
            id={buttonId<T>(idSchema, 'add')}

            className="rjsf-object-property-expan bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={onAddClick(schema)}
            disabled={disabled || readonly}
            registry={registry}
            uiSchema={uiSchema}
            />

            ) : null}
      </Accordion>
    </div>
  )
}
