import React, { useState, useEffect } from "react";
import { ChevronRight, LockKeyhole } from "lucide-react";
import { OpenAPISpec } from "@/types/openapi";
import { SwaggerSpec } from "@/types/swaggerSpec";

interface SidebarProps {
  spec: OpenAPISpec | SwaggerSpec | null | undefined;
  groups?: Record<string, string>;
  onSelect: (item: { path: string; method: string }) => void;
  theme?: "dark" | "light";
  isOpen?: boolean;
  onToggle?: () => void;
  error?: string | null;
}

type TagGroup = {
  key: string;
  name: string;
  description?: string;
};
const safeKey = (tag: string) => String(tag).replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
const groupSpec = (spec: any) => {
  if (!spec || !spec.paths || typeof spec.paths !== "object") {
    return { groupedPaths: {}, ungroupedPaths: [], tagsMeta: {} };
  }

  // 1. เก็บ meta ของ tags
  const tagsMeta: Record<string, TagGroup> = {};
  if (Array.isArray(spec.tags)) {
    spec.tags.forEach((tag: any) => {
      if (!tag?.name) return;
      const safeKeyName = safeKey(tag.name)
      tagsMeta[safeKeyName] = {
        key: safeKeyName,
        name: String(tag.name),
        description: tag.description || "",
      };
    });
  }

  // 2. แบ่งกลุ่ม paths
  const groupedPaths: Record<string, string[]> = {};
  const ungroupedPaths: string[] = [];

  Object.keys(spec.paths || {}).forEach((path) => {
    const pathItem = spec.paths?.[path];
    if (!pathItem || typeof pathItem !== "object") {
      ungroupedPaths.push(path);
      return;
    }

    const methods = Object.keys(pathItem);
    let grouped = false;

    methods.forEach((method) => {
      const op = pathItem?.[method];
      if (!op) return;

      const opTags: string[] = Array.isArray(op.tags) ? op.tags : [];
      if (opTags.length > 0) {
        const safeKeyName = safeKey(opTags[0])
        if (!groupedPaths[safeKeyName]) groupedPaths[safeKeyName] = [];
        if (!groupedPaths[safeKeyName].includes(path)) groupedPaths[safeKeyName].push(path);
        grouped = true;
      }
    });

    if (!grouped) {
      ungroupedPaths.push(path);
    }
  });

  return { groupedPaths, ungroupedPaths, tagsMeta };
};

export const Sidebar: React.FC<SidebarProps> = ({
  spec,
  groups,
  onSelect,
  theme = "light",
  isOpen = false,
  onToggle = () => {},
  error = null,
}) => {
  const [search, setSearch] = useState<string>("");
  const [filteredPaths, setFilteredPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!spec || !spec.paths || typeof spec.paths !== "object") {
      setFilteredPaths([]);
      return;
    }
    const allPaths = Object.keys(spec.paths);

    if (!search) {
      setFilteredPaths(allPaths);
    } else {
      const filtered: string[] = [];
      allPaths.forEach((path) => {
        const methods = Object.keys(spec.paths?.[path] || {});
        methods.forEach((method) => {
          const term = `${method.toUpperCase()} ${path}`.toLowerCase();
          if (term.includes(search.toLowerCase())) filtered.push(path);
        });
      });
      setFilteredPaths(Array.from(new Set(filtered)));
    }
  }, [search, spec]);

  const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "options", "head"];

  const renderMethodsForPath = (path: string) => {
    if (!spec?.paths?.[path]) return null;
    return Object.keys(spec.paths[path] || {})
      .filter((method) => HTTP_METHODS.includes(method.toLowerCase()))
      .map((method) => renderPathItem(path, method));
  };

  const formatMethod = (method: string) => {
    const colors: Record<string, string> = {
      get: "text-blue-600",
      post: "text-green-600",
      put: "text-yellow-600",
      delete: "text-red-600",
    };
    return <span className={`font-bold ${colors[method.toLowerCase()] || ""}`}>{method.toUpperCase()}</span>;
  };

  const formatPathGroup = (path: string) =>
    path
      .split("/")
      .filter(Boolean)
      .map((part, idx) => (
        <span key={idx} className={part.startsWith("{") ? "text-gray-500" : ""}>
          /{part}
        </span>
      ));

  // ✅ ใช้ groups ที่ส่งมา หรือ gen ใหม่จาก spec.tags
  let groupedPaths: Record<string, string[]> = {};
  let ungroupedPaths: string[] = [];
  let tagsMeta: Record<string, TagGroup> = {};

  if (groups && Object.keys(groups).length > 0) {
    // กรณีส่ง groups มาเอง
    filteredPaths.forEach((path) => {
      let matched = false;
      for (const [groupName, prefix] of Object.entries(groups)) {
        if (path.startsWith(prefix)) {
          if (!groupedPaths[groupName]) groupedPaths[groupName] = [];
          groupedPaths[groupName].push(path);
          matched = true;
          break;
        }
      }
      if (!matched) ungroupedPaths.push(path);
    });
  } else if (spec) {
    // กรณีไม่ได้ส่ง groups → ใช้ tags
    const result = groupSpec(spec);
    groupedPaths = result.groupedPaths;
    ungroupedPaths = result.ungroupedPaths;
    tagsMeta = result.tagsMeta;
  }

  const handleItemSelect = (item: { path: string; method: string }) => {
    onSelect(item);
    if (window.innerWidth < 1024) onToggle();
  };

  const renderPathItem = (path: string, method: string) => {
    const isDeprecated = spec?.paths?.[path]?.[method]?.deprecated;
    return (
      <div
        key={`${path}-${method}`}
        className={`
          cursor-pointer p-3 rounded-lg transition-all duration-200 border flex items-start gap-3
          ${theme === "dark"
            ? isDeprecated
              ? "bg-red-900/30 border-red-700/50"
              : "hover:bg-gray-700 hover:border-gray-600 border-gray-700/50"
            : isDeprecated
              ? "bg-red-100 border-red-300"
              : "hover:bg-gray-50 hover:border-gray-300 border-gray-200"
          }
        `}
        onClick={() => handleItemSelect({ path, method })}
      >
        <div className="flex-shrink-0">{formatMethod(method)}</div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-mono break-all ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } ${isDeprecated ? "line-through decoration-red-500 decoration-2" : ""}`}
          >
            {formatPathGroup(path)}
          </div>
          {spec?.paths?.[path]?.[method]?.summary && (
            <div
              className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {spec.paths[path][method].summary}
            </div>
          )}
        </div>
        {(spec?.paths?.[path]?.[method]?.security || spec?.security) && (
          <div className="flex-shrink-0 self-start ml-auto">
            <LockKeyhole
              className={`inline-block size-4 ${
                theme === "dark" ? "text-red-600" : "text-red-400"
              } drop-shadow-md`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && spec && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden"
          onClick={onToggle}
        />
      )}
      <div
        className={`
          fixed left-0 top-0 z-50 h-screen w-80 shrink-0
          flex flex-col border-r transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-1/4
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:flex lg:translate-x-0
          ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-300"}
        `}
      >
        {/* Header + search */}
        <div className={`border-b p-4 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
              Endpoints
            </h3>
            <button
              onClick={onToggle}
              className={`p-1 lg:hidden ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ChevronRight className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          {error && (
            <div
              className={`mt-2 p-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-yellow-900 text-yellow-200 border border-yellow-700"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              ⚠️ {error}
            </div>
          )}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search method/path..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-100 border-gray-300 text-gray-700"
              }`}
            />
          </div>
        </div>

        {/* เนื้อหา */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {Object.entries(groupedPaths).map(([groupKey, paths]) => (
            <div
              key={groupKey}
              className={`border-b pb-4 last:border-b-0 ${
                theme === "dark" ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <h4
                className={`font-semibold mb-1 px-2 py-1 rounded text-sm uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-200 bg-gray-700" : "text-gray-700 bg-gray-100"
                }`}
              >
                {tagsMeta[groupKey]?.name || groupKey}
              </h4>
              {tagsMeta[groupKey]?.description && (
                <p className="text-xs mb-2 px-2 text-gray-500">{tagsMeta[groupKey].description}</p>
              )}
              <div className="space-y-1">
                {paths.map((path) => renderMethodsForPath(path))}
              </div>
            </div>
          ))}

          {/* Ungrouped */}
          {ungroupedPaths.length > 0 && (
            <div
              className={`border-b pb-4 last:border-b-0 ${
                theme === "dark" ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <h4
                className={`font-semibold mb-3 px-2 py-1 rounded text-sm uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-200 bg-gray-700" : "text-gray-700 bg-gray-100"
                }`}
              >
                Other
              </h4>
              <div className="space-y-1">
                {ungroupedPaths.map((path) =>
                  Object.keys(spec?.paths?.[path] || {}).map((method) =>
                    renderPathItem(path, method)
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};