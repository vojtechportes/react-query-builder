import React from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

interface IUser {
  name: string;
  role: string;
}

const data: IUser[] = [
  { name: 'Ada', role: 'ADMIN' },
  { name: 'Grace', role: 'VIEWER' },
];

const helper = createColumnHelper<IUser>();

const columns = [
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('role', { header: 'Role' }),
];

const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  { field: 'role', label: 'Role', type: 'TEXT' },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'role', operator: 'EQUAL', value: 'ADMIN' }],
  },
];

export const TanstackFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: query },
    onGlobalFilterChange: setQuery,
    globalFilterFn: (row) => {
      const rule = 'type' in query[0] ? query[0].children[0] : query[0];
      return !rule || 'type' in rule || row.original.role === rule.value;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Builder fields={fields} data={query} onChange={setQuery} />
      <p>{table.getFilteredRowModel().rows.length} matching users</p>
    </>
  );
};
