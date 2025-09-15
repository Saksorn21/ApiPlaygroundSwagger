// src/hooks/useOpenApiSchema.ts
import { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { parse } from "flatted";

export const useOpenApiSchema = (version: string) => {
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const { data } = await axios.get(`/buildapi/schema/${version}`, {
          transformResponse: (res) => parse(res)
        });
        
        setSchema(data);
      } catch (err) {
        console.error("Error loading schema:", err);
      }
    };
    loadSchema();
  }, [version]);

  return {schema, setSchema}
};