import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { EndpointDetail } from "./EndpointDetail";
import { Menu } from 'lucide-react';
import { getBaseUrlFromSpec, chackSpecVersion } from "../utils";
import axios from "axios";
import { MOCKSPEC } from "../constants";
import SpecImporter from "@/components/SpecImporter";
import SpecExport from "@/components/SpecExport";
import { useApiSpecStore, reloadSpec } from "@/store/apiSpecStore";

interface ApiPlaygroundProps {
  specUrl?: string;
  theme?: 'dark' | 'light';
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ specUrl, theme = 'light' }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<{ path: string; method: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const spec = useApiSpecStore((state) => state.rawSpec);
  const resetSpec = useApiSpecStore((state) => state.reset);

  // ---------- Load Spec ----------
  useEffect(() => {
    const fetchSpec = async () => {
      if (spec) {
        setIsLoading(false);
        setError(null);
        return;
      }

      if (!specUrl) {
        reloadSpec(MOCKSPEC);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(specUrl);
        reloadSpec(res.data);
      } catch (err) {
        console.error("Failed to fetch spec:", err);
        setError("Failed to load spec from URL, using mock");
        reloadSpec(MOCKSPEC);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpec();
  }, [specUrl, spec]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTryEndpoint = async (
    spec: any,
    specUrl: string,
    method: string,
    path: string,
    params: { query?: any; body?: any; headers?: Record<string, any> }
  ) => {
    try {
      const baseUrl = getBaseUrlFromSpec(spec, specUrl);
      let finalPath = path;
      const resolved = {
        pathParams: { ...(params.query || {}) },
        query: { ...(params.query || {}) },
        headers: { ...(params.headers || {}) },
        body: params.body ? { ...params.body } : {},
      };

      Object.keys(params.query || {}).forEach((key) => {
        const placeholder = `{${key}}`;
        if (finalPath.includes(placeholder)) {
          finalPath = finalPath.replace(placeholder, encodeURIComponent(params.query![key]));
          delete resolved.query[key];
        }
      });

      const url = `${baseUrl}${finalPath}`;
      const axiosConfig: any = { method, url };
      if (method.toLowerCase() === "get") axiosConfig.params = resolved.query;
      else axiosConfig.data = resolved.body;
      if (Object.keys(resolved.headers).length) axiosConfig.headers = resolved.headers;

      const res = await axios(axiosConfig);
      return { data: res.data };
    } catch (err: any) {
      console.error(err);
      return { data: err.response?.data || err.message };
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading API specification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-60 p-2 rounded-md lg:hidden ${
          theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Menu className="size-5" />
      </button>

      <Sidebar
        spec={spec}
        onSelect={setSelectedEndpoint}
        theme={theme}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        error={error}
      />

      <div className={`flex-1 overflow-auto p-4 lg:p-6`}>
        {selectedEndpoint ? (
          <EndpointDetail
            spec={spec}
            specUrl={specUrl || ""}
            path={selectedEndpoint.path}
            method={selectedEndpoint.method}
            onTry={handleTryEndpoint}
            theme={theme}
          />
        ) : (
          <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <h2 className="text-2xl font-bold mb-4 text-shadow-md">Welcome to API Playground</h2>
            <p>Select an endpoint from the sidebar to get started.</p>
            <p>Swagger/OpenAPI version: {spec?.swagger ?? spec?.openapi}</p>
            <div className="flex flex-col items-center gap-4 mt-4">
              <SpecImporter theme={theme} />
              <SpecExport spec={spec} theme={theme} />
              <button
                onClick={() => resetSpec()}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Clear Spec
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};