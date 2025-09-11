import { useEffect, useState, useRef } from 'react';
import Form from '@rjsf/shadcn';
import { OpenAPISpec } from '@/types/openapi';
import { SchemaPathsTypeMap } from '@/utils/formSchema';
import validator from '@rjsf/validator-ajv8';

type Endpoint = { path: string; method: string };

export const PathsTab = ({
  spec,
  selectedEndpoint,
  activeBuildTab,
  handleFormChange,
}: {
  spec: OpenAPISpec;
  selectedEndpoint: Endpoint | null;
  activeBuildTab: string;
  handleFormChange: any;
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedEndpoint && activeBuildTab === 'paths') {
      // rjsf จะ generate id แบบ root_<propertyKey>
      const key = `paths_${selectedEndpoint.path}-${selectedEndpoint.method}`;
      const el = document.getElementById(`root_${key}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedEndpoint, activeBuildTab]);

  return (
    <div ref={formRef}>
      {activeBuildTab === 'paths' && (
        <Form
          schema={SchemaPathsTypeMap(spec)}
          formData={spec}
          onChange={handleFormChange}
          validator={validator}
        />
      )}
    </div>
  );
};
