// components/SpecImporter.tsx
import React, { useRef } from "react"
import yaml from "yaml"
import { useApiSpecStore, reloadSpec } from "@/store/apiSpecStore"
import { useNotify } from '@/hooks/useNotify'
import { FileDown } from 'lucide-react'
import clsx from "clsx"
import { OpenAPISpec } from "@/types/openapi"
const SpecImporter: React.FC<{ theme: "dark" | "light" }> = ({ theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const reload = useApiSpecStore((state) => state.reloadSpec)
  const StateError = useApiSpecStore((state) => state.error);
  const StateStatus = useApiSpecStore((state) => state.status);
  const notify = useNotify(theme)
  
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    let specJson: OpenAPISpec

    try {
      if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        specJson = yaml.parse(text) as OpenAPISpec
      } else {
        specJson = JSON.parse(text) as OpenAPISpec
      }

      await reloadSpec(specJson) // merge state
      if(StateStatus === 'error'){
        notify.error(StateError || "Something went wrong loading the spec.")
      }else{
      notify.success("Import spec สำเร็จ 🎉")
      }
      
    } catch (err) {
      console.error(err)
      notify.error("Import spec ไม่สำเร็จ")
    }
  }

  return (
    <div className="mb-3">
      <button
        className={clsx(
          "relative flex items-center px-2 py-2 drop-shadow-md rounded overflow-hidden",
          theme === "dark"
            ? "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500"
            : "bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="absolute top-0 left-0 h-full bg-purple-500 w-8"></span>
        <FileDown className="relative w-4 h-4 ml-1 z-10 text-white" />
        <span className="relative z-10 ml-2">Import Swagger/YAML</span>
      </button>

      <input
        type="file"
        accept=".json,.yaml,.yml"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  )
}

export default SpecImporter