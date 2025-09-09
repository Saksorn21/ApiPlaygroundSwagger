import React, { useState, useEffect } from "react";
import { ChevronRight, LockKeyhole } from "lucide-react";

interface SidebarProps {
  spec: any;
  groups?: Record<string, string>;
  onSelect: (item: { path: string; method: string }) => void;
  theme?: "dark" | "light";
  isOpen?: boolean;
  onToggle?: () => void;
  error?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  spec,
  groups = {},
  onSelect,
  theme = "light",
  isOpen = false,
  onToggle = () => {},
  error = null,
}) => {
  const [search, setSearch] = useState<string>("");
  const [filteredPaths, setFilteredPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!spec?.paths) return;

    const allPaths = Object.keys(spec.paths);

    if (!search) {
      setFilteredPaths(allPaths);
    } else {
      const filtered: string[] = [];
      allPaths.forEach((path) => {
        const methods = Object.keys(spec.paths[path]);
        methods.forEach((method) => {
          const term = `${method.toUpperCase()} ${path}`.toLowerCase();
          if (term.includes(search.toLowerCase())) filtered.push(path);
        });
      });
      // remove duplicates if multiple methods matched
      setFilteredPaths(Array.from(new Set(filtered)));
    }
  }, [search, spec]);
  const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "options", "head"];

  const renderMethodsForPath = (path: string) => {
    const pathItem = spec.paths[path];
    return Object.keys(pathItem)
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
    return <span className={`font-bold ${colors[method] || ""}`}>{method.toUpperCase()}</span>;
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

  // group paths
  const groupedPaths: Record<string, string[]> = {};
  const ungroupedPaths: string[] = [];

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

  const handleItemSelect = (item: { path: string; method: string }) => {
    onSelect(item);
    if (window.innerWidth < 1024) onToggle();
  };

  // render path item
  // render path item
  const renderPathItem = (path: string, method: string) => {
    const isDeprecated = spec.paths[path][method]?.deprecated;

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
          {spec.paths[path][method].summary && (
            <div
              className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {spec.paths[path][method].summary}
            </div>
          )}
        </div>
        {(spec.paths[path][method]?.security || spec?.security) && (
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
            <h3 className={`font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Endpoints</h3>
            <button
              onClick={onToggle}
              className={`p-1 lg:hidden ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
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

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Grouped */}
          {Object.entries(groupedPaths).map(([groupName, paths]) => (
            <div
              key={groupName}
              className={`border-b pb-4 last:border-b-0 ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}
            >
              <h4
                className={`font-semibold mb-3 px-2 py-1 rounded text-sm uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-200 bg-gray-700" : "text-gray-700 bg-gray-100"
                }`}
              >
                {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
              </h4>
              <div className="space-y-1">
                {paths.map((path) => renderMethodsForPath(path))}
              </div>
            </div>
          ))}

          {/* Ungrouped */}
          {ungroupedPaths.length > 0 && (
            <div className={`border-b pb-4 last:border-b-0 ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
              <h4
                className={`font-semibold mb-3 px-2 py-1 rounded text-sm uppercase tracking-wide ${
                  theme === "dark" ? "text-gray-200 bg-gray-700" : "text-gray-700 bg-gray-100"
                }`}
              >
                Other
              </h4>
              <div className="space-y-1">
                {ungroupedPaths.map((path) => Object.keys(spec.paths[path]).map((method) => renderPathItem(path, method)))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};