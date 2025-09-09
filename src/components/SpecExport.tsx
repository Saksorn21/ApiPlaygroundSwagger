import React from "react"
import { useApiSpecStore } from "@/store/apiSpecStore"
import { saveAs } from "file-saver" // ต้องติดตั้ง npm i file-saver
import YAML from "yaml"
import { FileUp, FileJson2, FileCode2 } from 'lucide-react'
interface SpecExportProps{
  theme: "dark" | "light"
  
}
const SpecExport: React.FC<SpecExportProps> = ({theme}) => {
  const spec = useApiSpecStore((state) => state.rawSpec)

  if (!spec) return null

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json;charset=utf-8" })
    saveAs(blob, `api-spec.json`)
  }

  const handleExportYAML = () => {
    const yamlText = YAML.stringify(spec)
    const blob = new Blob([yamlText], { type: "application/x-yaml;charset=utf-8" })
    saveAs(blob, `api-spec.yaml`)
  }

  return (
    <div className="flex gap-2 mt-2">
      <h3 className="text-lg font-semibold">
        <FileUp className="w-4 h-4 inline-block mr-1" />
        Export Spec
      </h3>
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleExportJSON}
      >
        <FileJson2 className="w-4 h-4 inline-block mr-1" />
        Export JSON
      </button>
      <button
        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
        onClick={handleExportYAML}
      >
        <FileCode2 className="w-4 h-4 inline-block mr-1" />
        Export YAML
      </button>
    </div>
  )
}

export default SpecExport