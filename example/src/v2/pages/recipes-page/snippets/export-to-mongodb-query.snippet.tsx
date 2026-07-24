import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const fields: IBuilderFieldProps[] = [
  {
    field: 'category',
    label: 'Category',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  {
    field: 'price',
    label: 'Price',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      { field: 'category', operator: 'EQUAL', value: 'books' },
      { field: 'price', operator: 'LARGER_EQUAL', value: 20 },
    ],
  },
];

export const MongoExportFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);
  const mongoQuery = formatQuery(query, 'Mongo', { fields });
  return (
    <>
      <Builder fields={fields} data={query} onChange={setQuery} />
      <pre>{mongoQuery}</pre>
    </>
  );
};
