import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeDataTable } from '../components/recipe-data-table';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import type { IRecipeDemoRow } from '../types/recipe-demo-row';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { doesRecipeRowMatch } from '../utils/does-recipe-row-match.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  {
    field: 'role',
    label: 'Role',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Admin', value: 'ADMIN' },
      { label: 'Editor', value: 'EDITOR' },
      { label: 'Viewer', value: 'VIEWER' },
    ],
  },
  {
    field: 'lastActive',
    label: 'Last active',
    type: 'DATE',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'role', operator: 'NOT_EQUAL', value: 'VIEWER' }],
  },
];
const columnHelper = createColumnHelper<IRecipeDemoRow>();
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.accessor('lastActive', { header: 'Last active' }),
  columnHelper.accessor('country', { header: 'Country' }),
];

export const TanstackTableFilteringDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const table = useReactTable({
    data: recipeDemoRows,
    columns,
    state: { globalFilter: query },
    onGlobalFilterChange: setQuery,
    globalFilterFn: (row) => doesRecipeRowMatch(row.original, query),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const visibleRows = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  return (
    <RecipeDemoFrame
      title="TanStack Table global filtering"
      note="Changing the Builder filters immediately updates the rows through TanStack Table."
    >
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={query}
            onChange={setQuery}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDataTable
          caption="TanStack filtered rows"
          columns={table.getHeaderGroups()[0].headers.map((header) => ({
            field: header.column.id,
            label: String(
              flexRender(header.column.columnDef.header, header.getContext())
            ),
          }))}
          rows={visibleRows}
        />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default TanstackTableFilteringDemo;
