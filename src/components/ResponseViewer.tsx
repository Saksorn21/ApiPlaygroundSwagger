import React from 'react';
import { JSONTree } from 'react-json-tree';

interface ResponseViewerProps {
  response: any;
  theme?: 'dark' | 'light';
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  theme = 'light',
}) => {
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
  if (!response)
    return (
      <div
        className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        No response yet
      </div>
    );

  return (
    <div
      className={`max-h-[60vh] overflow-auto rounded border p-2 ${
        theme === 'dark'
          ? 'border-gray-600 bg-gray-800'
          : 'border-gray-300 bg-white'
      }`}
    >
      <div className="relative max-w-full flex-1 overflow-auto">
        <div className="relative max-w-full overflow-auto rounded-lg">
          <JSONTree
            data={response}
            theme={jsonTreeTheme}
            invertTheme={false}
            hideRoot={false}
          />
        </div>
      </div>
    </div>
  );
};
