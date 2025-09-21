import React, { useState, useMemo, useEffect } from "react";
import Editor from "@monaco-editor/react";
import YAML from "yaml";
import clsx from "clsx";
import { OpenAPISpec, SwaggerSpec } from "@/types/openapi";

interface MonacoEditorProps {
  code: OpenAPISpec | SwaggerSpec;
  onChange: (value: OpenAPISpec | SwaggerSpec) => void;
  theme: "light" | "dark";
  className?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  onChange,
  theme,
  className,
}) => {
  const [language, setLanguage] = useState<"json" | "yaml">("yaml");

  const editorTheme = theme === "light" ? "vs-light" : "vs-dark";

  // แปลง object เป็น string ตาม language
  const codeString = useMemo(() => {
    try {
      return language === "json" ? JSON.stringify(code, null, 2) : YAML.stringify(code);
    } catch (e) {
      return "";
    }
  }, [code, language]);
  const [editorValue, setEditorValue] = useState("");

  // sync initial value เท่านั้น
  useEffect(() => {
    if (!editorValue) { // ถ้า editorValue ว่าง → ตั้งค่าเริ่มต้น
      try {
        setEditorValue(language === "json" ? JSON.stringify(code, null, 2) : YAML.stringify(code));
      } catch (e) {}
    }
  }, [code, language])
  // handle editor changes → แปลงกลับเป็น object
  const handleEditorChange = (value?: string) => {
    if (!value) return;
    setEditorValue(value)
    try {
      const parsed = language === "json" ? JSON.parse(value) : YAML.parse(value);
      onChange(parsed);
    } catch (e) {
      // ถ้า parse ไม่สำเร็จ ให้ ignore
    }
  };

  // toggle JSON ↔ YAML
  const toggleLanguage = () => {
    setEditorValue('')
    setLanguage(prev => (prev === "json" ? "yaml" : "json"));
    }

  return (
    <div className={clsx("flex flex-col h-full", className)}>
      <div className="flex justify-end p-2 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Switch to {language === "json" ? "YAML" : "JSON"}
        </button>
      </div>
      <Editor
        height="90vh"
        language={language}
        value={editorValue}
        theme={editorTheme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;