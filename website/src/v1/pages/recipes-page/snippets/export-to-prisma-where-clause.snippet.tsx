import React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'TEXT',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'total',
    label: 'Total',
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
      { field: 'status', operator: 'EQUAL', value: 'PAID' },
      { field: 'total', operator: 'LARGER_EQUAL', value: 100 },
    ],
  },
];

export const PrismaExportFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);

  const whereClause = formatQuery(query, 'Prisma', {
    fields,
    wrapWhereClause: true,
  });

  return (
    <>
      <Builder fields={fields} data={query} onChange={setQuery} />
      <pre>{whereClause}</pre>
    </>
  );
};
