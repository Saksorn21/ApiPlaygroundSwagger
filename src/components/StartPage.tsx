import React, { useState, useEffect } from "react";
import YAML from "yaml";
import SpecImporter from "@/components/SpecImporter";
import SpecExport from "@/components/SpecExport";
import { useApiSpecStore, reloadSpec } from "@/store/apiSpecStore";
import { SchemaInfoTypeMap, SchemaPathsTypeMap } from "@/utils/formSchema"
import DragDrop from '@/components/ui/DragDrop'
import { defaultSpec } from "@/utils/defaultSpecV3"
import { defaultSwagger2Spec as defaultSpecV2 } from "@/utils/defaultSpecV2"
import validator from "@rjsf/validator-ajv8";
import clsx from "clsx";
import Form from "@rjsf/shadcn";
import {JSONTree} from "react-json-tree";
import ScrollToActiveTabButton from '@/components/ScrollToActiveTabButton'
import {Sidebar} from '@/components/Sidebar'
import Layout from '@/components/Layout'
import { LoaderCircle } from 'lucide-react'
import SelectBar, { type ApiOption} from "@/components/ui/SelectBar"
import { PathsTab } from "@/components/buildTabs/PathsTab"
interface StartPageProps {
  theme: "dark" | "light"
}
const jsonTreeTheme = {
  scheme: 'monokai',
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};
// ... โค้ดด้านบนเหมือนเดิม ...

const StartPage: React.FC<StartPageProps > = ({theme}) => {
  const [url, setUrl] = useState("");
  const [activeBuildTab, setActiveBuildTab] = useState<"info" | "paths" | "components" | "preview">("info");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<{ path: string; method: string } | null>(null);
  const spec = useApiSpecStore((state) => state.rawSpec);
  const setSpecState = useApiSpecStore((state) => state.setRawSpec);
  const StateError = useApiSpecStore((state) => state.error);
  const StateStatus = useApiSpecStore((state) => state.status);
  const resetSpec = useApiSpecStore((state) => state.reset);

  // ---------- Load Spec from URL ----------
  const handleLoadUrl = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      reloadSpec(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load spec from URL");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Use Default Spec ----------
  const handleUseDefaultV3 = () => reloadSpec(defaultSpec);
  const handleUseDefaultV2 = () => reloadSpec(defaultSpecV2);

  // ---------- Dynamic Form ----------
  const handleFormChange = ({ formData }: any) => {
    if (!spec) return;
    const newSpec = { ...spec, ...formData };
    setSpecState(newSpec);
  };
  const apiOptions = (): ApiOption[] => {
    if (!spec || !spec.paths) return []

    const options: ApiOption[] = []
    for (const [path, methode] of Object.entries(spec.paths)) {
      if (!methode) continue
      for (const [method, details] of Object.entries(methode)) {
        if (!details) continue
        options.push({
          value: `${method}-${path}`,
          label: `${method.toUpperCase()} ${path}`,
          method: method.toUpperCase(),
          path,
          group: details.tags ? details.tags[0] : "Other",
          isDisabled: details.deprecated ? true : false
        })
      }
    }
    return options
  }
  useEffect(() => {
    
    if(selectedEndpoint?.path){
      setActiveBuildTab('paths')
    }
  if (selectedEndpoint && activeBuildTab === "paths") {
      const el = document.getElementById(`root_paths_${selectedEndpoint.path}-${selectedEndpoint.method}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedEndpoint, activeBuildTab, reloadSpec]);

  return (
    <Layout 
      theme={theme} 
      title="API Platform" 
      breadcrumbs={[{ label: 'Home'}]}
      menusideber={() => setSidebarOpen(!sidebarOpen)}
      isMenusideber={spec ? true : false}
      >
    <div className="max-w-4xl mx-auto p-6 space-y-6 dark:bg-gary-100">
      <h1 className="text-2xl font-bold">Start API Playground</h1>
      <SelectBar mode="api" theme={theme} optionApi={spec ? apiOptions() : []} />

      {/* Error Banner */}
      {StateStatus === "error" && (
        <div className="p-3 rounded bg-red-600 text-white font-semibold">
          {StateError || "Something went wrong loading the spec."}
        </div>
      )}

      {/* URL Loader */}
      <div className="space-y-2">
        <label className="block font-semibold">Load from URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://example.com/swagger.json"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <button
            className={clsx(
              "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700",
              (isLoading || StateStatus === "loading") && "opacity-50"
            )}
            onClick={handleLoadUrl}
            disabled={isLoading || StateStatus === "loading"}
          >
            {(isLoading || StateStatus === "loading") && (
              <LoaderCircle className="motion-reduce:hidden animate-spin inline-block mr-1 size-4" />
            )}
            {isLoading || StateStatus === "loading" ? "Loading..." : "Load"}
          </button>
        </div>
      </div>
      <DragDrop />

      {/* File Importer */}
      <SpecImporter theme={theme} />

      {/* Use Default */}
      <button
        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
        onClick={handleUseDefaultV2}
      >
        Build OpenAPI Spec V2
      </button>
      <button
        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
        onClick={handleUseDefaultV3}
      >
        Build OpenAPI Spec V3
      </button>

      <h2 className="font-bold text-lg text-center text-shadow-md">
        {spec && (spec.openapi ? `Build V${spec.openapi}` : `Build V${spec?.swagger}`)}
      </h2>

      {/* Dynamic Form + Tabs */}
      {spec && StateStatus !== "error" && (
        <div className="border rounded p-4 space-y-4 mt-4">
          <div className="border rounded p-4 space-y-4 mt-4">
            <h2 className="font-bold text-lg">Build / Edit Spec</h2>
              <div className={`flex border-b mb-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>

                <button
                  className={`px-3 py-1 ${activeBuildTab === 'info' ? 'border-b-2 border-blue-600' : ''} ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                  onClick={() => setActiveBuildTab('info')}
                >
                  Info
                </button>
                <button
                  className={`px-3 py-1 ${activeBuildTab === 'paths' ? 'border-b-2 border-blue-600' : ''} ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                  onClick={() => setActiveBuildTab('paths')}
                >
                  Paths 
                </button>
                <button
                  className={`px-3 py-1 ${activeBuildTab === 'components' ? 'border-b-2 border-blue-600' : ''} ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                  onClick={() => setActiveBuildTab('components')}
                >
                  Components
                </button>
                <button
                  className={`px-3 py-1 ${activeBuildTab === 'preview' ? 'border-b-2 border-blue-600' : ''} ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                  onClick={() => setActiveBuildTab('preview')}
                >
                  Spec Preview
                </button>
              </div>
            {activeBuildTab === 'info' && 
            <Form
              schema={SchemaInfoTypeMap(spec)}
                formData={spec}
                onChange={handleFormChange}
                validator={validator}


            />
            }
            <PathsTab
              activeBuildTab={activeBuildTab}
              spec={spec}
              handleFormChange={handleFormChange}
              validator={validator}
              selectedEndpoint={selectedEndpoint}
              />
      
            {/* Preview Tree */}
            {activeBuildTab === 'preview' &&
            <div className="mt-4">
              <h3 className="font-semibold">Spec Preview</h3>
              <JSONTree 
                data={spec} theme={jsonTreeTheme}
                invertTheme={false}
                hideRoot={true} />
            </div>
            }
          </div>
        </div>
      )}

      {/* Export Spec */}
      {spec && StateStatus !== "error" && <SpecExport theme={theme} />}

      <ScrollToActiveTabButton activeTabId={activeBuildTab} />
    </div>
      
      <Sidebar
        spec={spec}
        onSelect={setSelectedEndpoint}
        theme={theme}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        error={StateError}
      />
    </Layout>
  );
};

export default StartPage;
