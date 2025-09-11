import React from 'react';
import { CircleOff } from 'lucide-react';
interface NoRequireProps {
  title: string;
  theme?: 'dark' | 'light';
}

const NoRequire: React.FC<NoRequireProps> = ({ title, theme = 'light' }) => {
  return (
    <div
      className={`mb-2 border p-2 text-center shadow-md ${
        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
      }`}
    >
      <CircleOff className="mb-2 mt-2 inline-block size-20 font-bold text-red-300 drop-shadow-lg " />
      <h4 className="mb-1 text-lg font-bold text-gray-600 text-shadow-sm">
        No {title}
      </h4>
      <p className="text-gray-500 text-shadow-sm">
        This endpoint does not require any {title}
      </p>
    </div>
  );
};

export default NoRequire;
