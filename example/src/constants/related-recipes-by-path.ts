export const relatedRecipesByPath: Record<
  string,
  { path: string; label: string }[]
> = {
  '/documentation/dynamic-field-options': [
    {
      path: '/recipes/dynamic-operators-by-field-type',
      label: 'Dynamic operators by field type',
    },
  ],
  '/documentation/validation': [
    {
      path: '/recipes/save-load-filter-presets',
      label: 'Save and validate filter presets',
    },
    { path: '/recipes/server-side-filtering', label: 'Server-side filtering' },
    {
      path: '/recipes/ai-assisted-filter-creation',
      label: 'AI-assisted filter creation',
    },
  ],
  '/documentation/history': [
    {
      path: '/recipes/persist-filters-in-url',
      label: 'Persist filters in URL state',
    },
    {
      path: '/recipes/save-load-filter-presets',
      label: 'Save and load filter presets',
    },
  ],
  '/documentation/locking-and-read-only': [
    {
      path: '/recipes/server-side-filtering',
      label: 'Enforce filters on the server',
    },
    {
      path: '/recipes/ai-assisted-filter-creation',
      label: 'Review AI-generated draft filters',
    },
  ],
  '/documentation/parsing-and-formatting/supported-formats': [
    {
      path: '/recipes/sql-where-to-react-query-builder',
      label: 'Import a SQL WHERE clause',
    },
    {
      path: '/recipes/export-to-mongodb-query',
      label: 'Export a MongoDB query',
    },
    {
      path: '/recipes/export-to-prisma-where-clause',
      label: 'Export a Prisma where clause',
    },
  ],
  '/documentation/components': [
    {
      path: '/recipes/ag-grid-query-builder',
      label: 'AG Grid external filter panel',
    },
    {
      path: '/recipes/tanstack-table-filtering',
      label: 'TanStack Table filtering',
    },
    {
      path: '/recipes/react-hook-form-query-builder',
      label: 'React Hook Form integration',
    },
  ],
  '/documentation/adapters/mui': [
    {
      path: '/recipes/mui-datagrid-advanced-filtering',
      label: 'MUI DataGrid advanced filtering',
    },
  ],
  '/api/fields': [
    {
      path: '/recipes/dynamic-operators-by-field-type',
      label: 'Dynamic operators by field type',
    },
  ],
  '/api/components': [
    {
      path: '/recipes/ag-grid-query-builder',
      label: 'AG Grid query builder panel',
    },
    {
      path: '/recipes/react-hook-form-query-builder',
      label: 'React Hook Form integration',
    },
  ],
  '/api/adapters/mui': [
    {
      path: '/recipes/mui-datagrid-advanced-filtering',
      label: 'MUI DataGrid advanced filtering',
    },
  ],
  '/api/format-query': [
    { path: '/recipes/export-to-mongodb-query', label: 'Export to MongoDB' },
    {
      path: '/recipes/export-to-prisma-where-clause',
      label: 'Export to Prisma',
    },
  ],
  '/api/parse-query': [
    {
      path: '/recipes/sql-where-to-react-query-builder',
      label: 'SQL WHERE to builder data',
    },
  ],
};
