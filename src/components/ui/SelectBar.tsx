import React, { useState } from "react";
import Select, { components, StylesConfig } from "react-select";

export interface ApiOption {
  value: string;
  label: string;
  method: string;
  path: string;
  group: string;
  isDisabled?: boolean
}

interface GroupedOption {
  label: string;
  options: ApiOption[];
}
interface SelectBarProps {
  mode?: "all" | "api"
  theme?: "dark" | "light"
  optionApi?: ApiOption[]
}
const methodColors: Record<string, string> = {
  GET: "#4CAF50",
  POST: "#2196F3",
  PUT: "#FFC107",
  DELETE: "#F44336",
  PATCH: "#9C27B0",
};

const CustomOption = (props: any) => {
  const { method } = props.data;
  return (
    <components.Option {...props}>
      <span
        style={{
          display: "inline-block",
          minWidth: 60,
          fontWeight: "bold",
          color: methodColors[method] || "#fff",
        }}
      >
        {method}
      </span>
      <span>{props.data.path}</span>
    </components.Option>
  );
};
const getSelectStyles = (theme: "dark" | "light"): StylesConfig<ApiOption, false> => ({
  control: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#111" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    borderColor: theme === "dark" ? "#333" : "#ccc",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#222" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "#333"
        : "#eee"
      : theme === "dark"
      ? "#222"
      : "#fff",
    color: state.isDisabled
      ? theme === "dark"
        ? "#777"
        : "#aaa" // เทาเวลา disable
      : theme === "dark"
      ? "#fff"
      : "#000",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.5 : 1,
  }),
  groupHeading: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#000" : "#f5f5f5",
    color: theme === "dark" ? "#0ff" : "#0077aa",
    fontWeight: "bold",
    padding: "6px 12px",
  }),
});
function groupByTag(options: ApiOption[]): GroupedOption[] {
  const groups: Record<string, ApiOption[]> = {};
  options.forEach((opt) => {
    if (!groups[opt.group]) groups[opt.group] = [];
    groups[opt.group].push(opt);
  });
  return Object.entries(groups).map(([group, opts]) => ({
    label: group,
    options: opts,
  }));
}

export default function SelectBar({
  mode = "all",
  theme = "light",
  optionApi = []
}: SelectBarProps) {
  const [selected, setSelected] = useState<ApiOption | null>(null);
 
  const apiOption: ApiOption[] = [
    { value: "get-/users", label: "GET /users", method: "GET", path: "/users", group: "User", isDisabled: false },
    { value: "post-/users", label: "POST /users", method: "POST", path: "/users", group: "User" },
    { value: "get-/products", label: "GET /products", method: "GET", path: "/products", group: "Product" },
    { value: "delete-/products/{id}", label: "DELETE /products/{id}", method: "DELETE", path: "/products/{id}", group: "Product" },
  ];
  const apiOptions = optionApi.length > 0 ? optionApi : apiOption
  const options = mode === "api" ? groupByTag(apiOptions) : apiOptions;

  return (
    <Select<ApiOption, false, GroupedOption>
      className="basic-single"
      classNamePrefix="select method/path/group"
      options={options}
      value={selected}
      onChange={setSelected}
      //placeholder="Search method/path/group..."
      isSearchable
  isClearable
      components={{ Option: CustomOption }}
      filterOption={(option, input) => {
        if (!input) return true;
        const target = `${option.data.method} ${option.data.path} ${option.data.group}`.toLowerCase();
        return target.includes(input.toLowerCase());
      }}
          styles={getSelectStyles(theme)}
    />
  );
}