import React, { useState, useEffect } from 'react';
import SpecImporter from '@/components/SpecImporter';
import SpecExport from '@/components/SpecExport';
import { useApiSpecStore, reloadSpec } from '@/store/apiSpecStore';
import { SchemaTypeMap } from '@/utils/formSchema';
import uiSchema from '@/utils/uiSchema'
import DragDrop from '@/components/ui/DragDrop';
import { defaultSpec } from '@/utils/defaultSpecV3';
import { defaultSwagger2Spec as defaultSpecV2 } from '@/utils/defaultSpecV2';
import validate from '@rjsf/validator-ajv8';
import clsx from 'clsx';
import Form from '@rjsf/shadcn';
import ApiOverview from '@/components/apiSpec/ApiOverview'
import { JSONTree } from 'react-json-tree';
import { useOpenApiSchema } from "@/hooks/useOpenApiSchema";

import ScrollToActiveTabButton from '@/components/ScrollToActiveTabButton';
import { Sidebar } from '@/components/Sidebar';
import Layout from '@/components/Layout';
import { LoaderCircle } from 'lucide-react';
import SelectBar, { type ApiOption } from '@/components/ui/SelectBar';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { useNotify } from '@/hooks/useNotify';
import Ajv from "ajv/dist/jtd"; // AJV v8
import addFormats from "ajv-formats";
import { OpenAPISpec, SwaggerSpec } from '@/types/openapi'
import { useTranslation } from "react-i18next"
import MonacoEditor from '@/components/MonacoEditor'
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Compile schema

import { JsonEditor } from 'json-edit-react'

import FormRjsf from '@/components/buildTabs/FormRjsf'
interface StartPageProps {
  theme: 'dark' | 'light';
}
const jsonTreeTheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};
// ... โค้ดด้านบนเหมือนเดิม ...

const StartPage: React.FC<StartPageProps> = ({ theme }) => {
  const { t } = useTranslation()
  const [url, setUrl] = useState('');
  const [activeBuildTab, setActiveBuildTab] = useState<
    'info' | 'paths' | 'components' | 'preview'
  >('info');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<{
    path: string;
    method: string;
  } | null>(null);
  const notify = useNotify(theme);
  const [testUi, setTestUi] = useState('');
  const spec = useApiSpecStore((state) => state.rawSpec);
  const [useSpec, setUseSpec] = useState<OpenAPISpec | SwaggerSpec | null>(null)
  const setSpecState = useApiSpecStore((state) => state.setRawSpec);
  const StateError = useApiSpecStore((state) => state.error);
  const StateStatus = useApiSpecStore((state) => state.status);
  const {schema, setSchema} = useOpenApiSchema("v2")
  // ดึงเฉพาะส่วน info

  // ---------- Load Spec from URL ----------
  const handleLoadUrl = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      reloadSpec(data);
      notify.success('Spec loaded successfully')
    } catch (err) {
      console.error(err);
      notify.error('Failed to load spec from URL');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Use Default Spec ----------
  const handleUseDefaultV3 = () => reloadSpec(defaultSpec);
  const handleUseDefaultV2 = () => reloadSpec(defaultSpecV2 as any);

  // ---------- Dynamic Form ----------
  const handleFormChange = ({ formData }: any) => {
    if (!spec) return;
    const newSpec = { ...spec, ...formData };
    setSpecState(newSpec);
  };
  const apiOptions = (): ApiOption[] => {
    if (!spec || !spec.paths) return [];

    const options: ApiOption[] = [];
    for (const [path, methode] of Object.entries(spec.paths)) {
      if (!methode) continue;
      for (const [method, details] of Object.entries(methode)) {
        if (!details || typeof details !== 'object') continue;
        const methodDetails = details as any;
        options.push({
          value: `${method}-${path}`,
          label: `${method.toUpperCase()} ${path}`,
          method: method.toUpperCase(),
          path,
          group: methodDetails.tags ? methodDetails.tags[0] : 'Other',
          isDisabled: methodDetails.deprecated ? true : false,
        });
      }
    }
    return options;
  };
  // Removed custom AJV instance - using built-in validator from @rjsf/validator-ajv8 instead
  useEffect(() => {
    
      if (spec) {
        setUseSpec(spec);
      }

    // if(selectedEndpoint?.path){
    //   setActiveBuildTab('paths')
    // }
    // if (selectedEndpoint && activeBuildTab === "paths") {
    //     const el = document.getElementById(`root_paths_${selectedEndpoint.path}-${selectedEndpoint.method}`);
    //     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    //   }
  }, [selectedEndpoint, activeBuildTab, spec]);
  
  
  
  const tabSchema = (() => {
    switch(activeBuildTab) {
      case "info": return SchemaTypeMap(useSpec, 'info')
      case "paths": return SchemaTypeMap(useSpec, 'paths')
      case "components": return SchemaTypeMap(useSpec, 'components')// OpenAPI 2.0 ใช้ definitions
      default:
        return SchemaTypeMap(useSpec, 'info')
    }
  })()
  const handleValidate = () => {
    const validate = ajv.compile(tabSchema);
    const valid = validate(spec[activeBuildTab]);
    if (!valid) notify.error(JSON.stringify(validate.errors));
    
    if (!spec || !tabSchema) {
      notify.error("No spec or schema available for validation");
      return;
    }
    
    try {
      const currentData = activeBuildTab === 'info' ? spec.info : 
                          activeBuildTab === 'paths' ? spec.paths :
                          activeBuildTab === 'components' ? (spec as any).definitions || (spec as any).components : null;
      
      if (!currentData) {
        notify.error("No data available for validation");
        return;
      }
      
      const result = validate.validateFormData(currentData, tabSchema);
      if (result.errors && result.errors.length > 0) {
        notify.error("Validation errors:"+JSON.stringify(result.errors));
      } else {
        console.log("Valid!");
      }
    } catch(err) {
      notify.error("Validation failed:"+ JSON.stringify(err));
    }
  }
  return (
    <Layout
      theme={theme}
      title="API Platform"
      breadcrumbs={[{ label: 'Home' }]}
      menusideber={() => setSidebarOpen(!sidebarOpen)}
      isMenusideber={spec ? true : false}
    >
      <div className="dark:bg-gary-100 mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Start API Playground</h1>
        <SelectBar
          mode="api"
          theme={theme}
          optionApi={spec ? apiOptions() : []}
        />
  
        {/* Error Banner */}
        {testUi && <div>{testUi}</div>}
        {StateStatus === 'error' && (
          <div className="rounded bg-red-600 p-3 font-semibold text-white">
            {StateError || 'Something went wrong loading the spec.'}
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
              className="flex-1 rounded border px-2 py-1"
            />
            <button
              className={clsx(
                'rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700',
                (isLoading || StateStatus === 'loading') && 'opacity-50',
              )}
              onClick={handleLoadUrl}
              disabled={isLoading || StateStatus === 'loading'}
            >
              {(isLoading || StateStatus === 'loading') && (
                <LoaderCircle className="mr-1 inline-block size-4 animate-spin motion-reduce:hidden" />
              )}
              {isLoading || StateStatus === 'loading' ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>
        <DragDrop />
        {/* File Importer */}
        <SpecImporter theme={theme} />
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          onClick={handleValidate}
        >
          Validate Spec
        </button>
        {/* Use Default */}
        
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          onClick={handleUseDefaultV2}
        >
          Build OpenAPI Spec V2
        </button>
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          onClick={handleUseDefaultV3}
        >
          Build OpenAPI Spec V3
        </button>

        <h2 className="text-center text-lg font-bold text-shadow-md">
          {spec &&
            ((spec as any).openapi
              ? `Build V${(spec as any).openapi}`
              : `Build V${(spec as any)?.swagger}`)}
        </h2>
        {/* {spec && <MonacoEditor 
                   code={useSpec || spec} 
                   onChange={(value) => setUseSpec(value)}
                   theme={theme}
                   
                   />
        } */}
        
        {/* Dynamic Form + Tabs */}
        {spec && StateStatus !== 'error' && (
          <div>
            <div className="mt-4 space-y-4 rounded border p-3 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-bold">Build / Edit Spec</h2>
              <div
                className={`mb-2 flex border-b ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                }`} style={{ marginBottom: 16 }}
              >
                <button
                  className={`px-3 py-1 ${
                    activeBuildTab === 'info'
                      ? 'border-b-2 border-blue-600'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  onClick={() => setActiveBuildTab('info')}
                >
                  Info
                </button>
                <button
                  className={`px-3 py-1 ${
                    activeBuildTab === 'paths'
                      ? 'border-b-2 border-blue-600'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  onClick={() => setActiveBuildTab('paths')}
                >
                  Paths
                </button>
                <button
                  className={`px-3 py-1 ${
                    activeBuildTab === 'components'
                      ? 'border-b-2 border-blue-600'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  onClick={() => setActiveBuildTab('components')}
                >
                  Components
                </button>
                <button
                  className={`px-3 py-1 ${
                    activeBuildTab === 'preview'
                      ? 'border-b-2 border-blue-600'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  onClick={() => setActiveBuildTab('preview')}
                >
                  Spec Preview
                </button>
              </div>
              {activeBuildTab === 'info' && useSpec && <ApiOverview spec={useSpec} onSpecChange={(e) =>setUseSpec(e)} onSpecError={(e) => {
            e.map((err, idx) => {
              notify.error(`'${err.property}' ${err.message}`)
            })
              }}
                                                         />
                                                  }
              {activeBuildTab !== 'preview' && useSpec &&
                <FormRjsf
                  spec={useSpec}
                  activeTab={activeBuildTab}
                  handleFormChange={handleFormChange}
                  onError={(e) => {
                    e.map((err, idx) => {
                      notify.error(`'${err.property}' ${err.message}`)
                    })
                  }}
                  />
              }
 
              {/* Preview Tree */}
              {activeBuildTab === 'preview' && (
                <div className="mt-4">
                  <h3 className="font-semibold">Spec Preview</h3>
                  <JsonEditor
                    data={useSpec || spec}
                    />
                  <JSONTree
                    data={useSpec || spec}
                    theme={jsonTreeTheme}
                    invertTheme={false}
                    hideRoot={true}
                  />
                  <JsonView
                    src={useSpec || spec}
                    theme={theme === 'dark' ? 'atom' : 'github'}
                    collapsed={1}
                    collapseStringMode="directly"
                    collapseStringsAfterLength={20}
                    //dark={theme === 'dark'}
                    editable
                    onEdit={(params) => {
                      const { indexOrName } = params;
                      if (indexOrName === 'openapi' || indexOrName === 'swagger') {
                        notify.error("You can't change the version of the spec");
                        return false;
                      }

                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Spec */}
        {spec && StateStatus !== 'error' && <SpecExport theme={theme} />}

        <ScrollToActiveTabButton activeTabId={activeBuildTab} />
      </div>

      <Sidebar
        spec={useSpec ? useSpec : spec}
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
