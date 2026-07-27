export const fieldComparisonSnippet = `import React, { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL'],
    fieldComparison: {
      type: 'number',
      comparableFields: ['ORDER_APPROVAL_LIMIT'],
    },
  },
  {
    field: 'ORDER_APPROVAL_LIMIT',
    label: 'Approval limit',
    type: 'NUMBER',
    operators: ['LARGER_EQUAL'],
  },
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
    fieldComparison: {
      type: 'string',
      comparableFields: ['DELIVERY_COUNTRY_CODE'],
    },
  },
  {
    field: 'DELIVERY_COUNTRY_CODE',
    label: 'Delivery country code',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'ORDER_TOTAL',
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: 'ORDER_APPROVAL_LIMIT',
      },
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'DELIVERY_COUNTRY_CODE',
      },
    ],
  },
];

export const FieldComparisonBuilder = () => {
  const [data, setData] = useState(initialData);

  return (
    <Builder
      allowFieldComparisons
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;
