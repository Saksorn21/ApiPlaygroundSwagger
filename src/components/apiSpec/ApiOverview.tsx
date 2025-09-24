import React, { useEffect, useState, useRef } from 'react'
import { OpenAPIV3 } from 'openapi-types'
import { ErrorObject } from 'ajv'
import { Badge } from "@/components/ui/badge"
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNotify } from '@/hooks/useNotify'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { parserSpecAndValidate } from '@/utils'
import clsx from 'clsx'
  interface ApiOverviewProps {
  spec: OpenAPIV3.Document
  onSpecChange: (newSpec: OpenAPIV3.Document) => void
  onSpecError: (error: ErrorObject[]) => void
  
  
}
const schema = z.object({
  title: z.string(),
  version: z.string(),
  description: z.string().optional(),
  termsOfService: z.string().optional(),
  contact: z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    email: z.string().email().optional()
}).optional(),
  license: z.object({
    name: z.string(),
    url: z.string().optional()
  }),
  
})
const schemaData = z.infer<typeof schema>
const ApiOverview: React.FC<ApiOverviewProps> = ({ spec, onSpecChange, onSpecError}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedSpec, setEditedSpec] = useState<OpenAPIV3.Document>(null)
  const editorRef = useRef(null)
  const { t } = useTranslation()
  const notify = useNotify()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<typeof schemaData>({
    resolver: zodResolver(schema)
  })
  useEffect(() => {
    if(spec) {
    setEditedSpec(spec)
    }
  },[editedSpec])
  const info = spec.info as OpenAPIV3.InfoObject
 // const servers = spec.servers as OpenAPIV3.ServerObject[]
  const handleEdit = () => setIsEditing(true)
  const handleSave = (newSpec) => {
    setIsEditing(false)
    onSpecChange(newSpec)
  }
  return (
    <div  >
      <div className='flex items-center p-4'>
      <Badge
        variant="secondary"
        className="bg-indigo-500 text-white h-8 top-0 text-sm items-center dark:bg-indigo-600 drop-shadow-md "
      >{info.version}</Badge> 
      <h1 className='text-3xl font-bold m-4 text-shadow-sm'>{info.title}</h1>
      </div>
      <form onSubmit={handleSubmit((data) => {
      const newSpec = { ...editedSpec, info: data}
        handleSave(newSpec)
      })}
        className='mt-8 space-y-6'
        >
        <div className='space-y-4' >
          <label className='block text-sm font-semibold text-slate-700 dark:text-slate-300 text-md' htmlFor='info_title'>{t('openapi.info.title')}</label>
          <input {...register('title')}
            className={clsx('block h-10 p-2 w-full rounded-sm border-1 border-slate-400  shadow-sm font-medium focus:border-indigo-500 focus:outline-indigo-500 focus:outline sm:text-sm dark:border-slate-700 dark:bg-slate-400 dark:text-slate-800 dark:focus:border-indigo-500 dark:focus:outline-indigo-500',errors.title && 'border-red-500 focus:border-red-500 focus:ring-red-500 ')}
            id='info.title'
            defaultValue={info.title}
            />
          {errors.title && <span className='text-red-500 text-sm font-samibold'> {errors.title.message} </span>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full justify-center rounded-lg bg-indigo-600 p-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {isSubmitting ? 'Save...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
export default ApiOverview