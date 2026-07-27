export const relatedRecipesByPath: Record<
  string,
  { path: string; label: string }[]
> = {
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
