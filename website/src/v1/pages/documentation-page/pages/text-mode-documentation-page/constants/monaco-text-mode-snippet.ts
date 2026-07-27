export const monacoTextModeSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents({});

export const MonacoTextModeBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
      textMode
      defaultMode="text"
      components={components}
      onChange={setData}
    />
  );
};`;
