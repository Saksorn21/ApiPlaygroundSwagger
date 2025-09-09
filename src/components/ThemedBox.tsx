import React from "react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemedBoxProps {
  theme?: "dark" | "light"; // optional override
  children: React.ReactNode;
  className?: string;
}

export const ThemedBox: React.FC<ThemedBoxProps> = ({ theme: overrideTheme, children, className }) => {
  const theme = useTheme(overrideTheme);

  return (
    <div
      className={` ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"} ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};