import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const fields: IBuilderFieldProps[] = [
  {
    field: 'country',
    label: 'Country',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Czech Republic', value: 'CZ' },
      { label: 'Germany', value: 'DE' },
    ],
  },
  {
    field: 'orderTotal',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
  {
    field: 'customerType',
    label: 'Customer type',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Business', value: 'BUSINESS' },
      { label: 'Consumer', value: 'CONSUMER' },
    ],
  },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'country',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: true,
      },
      { field: 'orderTotal', operator: 'LARGER_EQUAL', value: 2500 },
      {
        field: 'customerType',
        operator: 'EQUAL',
        value: 'BUSINESS',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
    ],
  },
];

const monacoComponents = createMonacoComponents({});

export const HomeTextModeDemo: React.FC = () => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialQuery);

  return (
    <Builder
      components={monacoComponents}
      data={data}
      defaultMode="text"
      fields={fields}
      onChange={setData}
      singleRootGroup
      textMode
    />
  );
};

export default HomeTextModeDemo;
