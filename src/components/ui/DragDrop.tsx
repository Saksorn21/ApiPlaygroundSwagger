import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useApiSpecStore, reloadSpec } from "@/store/apiSpecStore";
import { FileDown } from 'lucide-react'
import { OpenAPISpec } from '@/types/openapi'
import yaml from 'yaml'
import { SwaggerSpec } from '@/types/swaggerSpec'
export default function DragDrop() {
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // เลือกไฟล์แรก
    console.log("ไฟล์ที่ได้:", file);

    const text = await file.text();
    let specJson: OpenAPISpec;

    try {
      if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        specJson = yaml.parse(text) as OpenAPISpec;
      } else {
        specJson = JSON.parse(text) as OpenAPISpec;
      }

      await reloadSpec(specJson);
    } catch (err) {
      console.error("ไฟล์ไม่ถูกต้อง:", err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive,  acceptedFiles} = useDropzone({ 
    onDrop,
    multiple: false,
    accept: {
      "application/json": [".json"],
      "application/x-yaml": [".yaml", ".yml"],
      "text/yaml": [".yaml", ".yml"],
      "text/plain": [".yaml", ".yml"], // เผื่อ browser บางตัวอ่าน YAML เป็น text/plain
    }
                                                                    });
  const files = acceptedFiles.map(file => (

    <li key={file.name}>
      {file.path} - {file.size} bytes
    </li>
  ));
useEffect(() => {
  console.log(JSON.stringify(acceptedFiles.map((file) => file), null, 2))
}, [acceptedFiles, reloadSpec])
  return (
    <div className="container">
    <div
      {...getRootProps()}
      className={`hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300 dark:hover:bg-slate-700/40
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-gray-100"}
      `}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600 font-medium">ปล่อยไฟล์ที่นี่...</p>
      ) : (
        <p className="text-gray-600">ลากไฟล์มาวาง .json/.yaml/.yml หรือคลิกเพื่อเลือกไฟล์</p>
      )}
      <FileDown className="mx-auto size-12 drop-shadow-md group-hover:text-blue-500 mb-1 text-slate-400 dark:group-hover:text-slate-300 "/>
    </div>
      {files.length > 0 && (
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      )}
      </div>
  );
}