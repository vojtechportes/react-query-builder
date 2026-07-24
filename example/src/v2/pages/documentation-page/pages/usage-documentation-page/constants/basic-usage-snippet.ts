export const basicUsageSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATE',
    label: 'State',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Is in EU',
    type: 'BOOLEAN',
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATE',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: true,
      },
      {
        field: 'IS_IN_EU',
        operator: 'EQUAL',
        value: true,
      },
    ],
  },
];

export const MyBuilder = () => {
  const [data, setData] = useState(initialData);

  return <Builder fields={fields} data={data} onChange={setData} />;
};`;
