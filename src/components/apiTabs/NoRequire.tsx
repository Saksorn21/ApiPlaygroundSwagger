import React from 'react';
import { CircleOff } from 'lucide-react'
interface NoRequireProps {
  title: string
  theme?: 'dark' | 'light'
}

const NoRequire: React.FC<NoRequireProps> = ({ title, theme = 'light' }) => {
  return (
    <div className={`border p-2 mb-2 text-center shadow-md ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
      <CircleOff className='text-red-300 size-20 font-bold inline-block mt-2 mb-2 drop-shadow-lg ' />
      <h4 className="font-bold mb-1 text-lg text-gray-600 text-shadow-sm">No {title}</h4>
      <p className="text-gray-500 text-shadow-sm">
        This endpoint does not require any {title}
      </p>
    </div>
  );
};

export default NoRequire;