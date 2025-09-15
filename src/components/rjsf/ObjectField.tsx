import {
  getTemplate,
  getUiOptions,
  titleId,
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  ObjectFieldTemplateProps,
} from "@rjsf/utils"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Plus } from 'lucide-react'
function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    registry,
    properties,
    title,
    description,
    uiSchema,
    required,
    schema,
    idSchema,
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

  return (
    <div className="border rounded-md p-4 space-y-4">
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
        {properties.map((prop) => (
          <AccordionItem key={prop.name} value={prop.name}>
            <AccordionTrigger>{prop.name}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {prop.content}

              {/* ถ้าเป็น array/object จะมี add/remove */}
              {prop.onDropPropertyClick && (
            <button
              type="button"
              className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={props.onAddClick(props.schema)}
              >
              <Plus className='size-4' />
              remove
            </button>
              )}
              {props.onAddClick && (
            <button
              type="button"
              className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={props.onAddClick(schema)}
              >
              <Plus className='size-4' />
              Add
            </button>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}