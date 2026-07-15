import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/tanstack-table-filtering.snippet.tsx?raw';

export const tanstackTableFilteringRecipe: IRecipePage = {
  path: '/recipes/tanstack-table-filtering',
  demoLoader: () => import('../demos/tanstack-table-filtering.demo'),
  title: 'TanStack Table Filtering with React Query Builder',
  summary:
    'Use nested Builder rules to decide which TanStack Table rows to show.',
  description:
    'Connect React Query Builder to TanStack Table so nested AND/OR rules decide which rows are shown.',
  groupKey: 'integrations',
  primaryKeyword: 'TanStack Table filtering',
  secondaryKeywords: ['React Table query builder', 'TanStack advanced filters'],
  searchText:
    'TanStack Table useReactTable globalFilterFn controlled state rows columns',
  relatedRecipePaths: [
    '/recipes/ag-grid-query-builder',
    '/recipes/server-side-filtering',
  ],
  relatedDocPaths: [
    '/documentation/usage',
    '/api/data',
    '/documentation/validation',
  ],
  externalReferences: [
    {
      label: 'TanStack Table filtering',
      href: 'https://tanstack.com/table/latest/docs/guide/column-filtering',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder @tanstack/react-table`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'name', label: 'Name', type: 'TEXT' },
  { field: 'role', label: 'Role', type: 'LIST', value: roles },
  { field: 'lastActive', label: 'Last active', type: 'DATE' },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Check whether each row matches',
  transformCode: `const matchesUser = (user: User, query: DenormalizedQuery) =>
  compileQuery<User>(query, fields)(user);`,
  capabilities: [
    'React state keeps the Builder and table filters in sync.',
    'One table filter checks nested AND/OR conditions across several columns.',
    'Filter data that can be evaluated in the browser or sent to a server.',
  ],
  safetyNotes: [
    'Client filtering only controls display and cannot protect records.',
    'Filter protected rows on the server before sending them to the browser.',
  ],
  productionNotes: [
    'Use the useMemo hook so the row-matching function is not rebuilt on every render.',
    'For server-side pagination, enable manualFiltering in TanStack Table and send the filters with each request.',
  ],
  faqs: [
    {
      question: 'Why does the table not update when the Builder filter changes?',
      answer:
        'Pass the Builder data to TanStack Table as its globalFilter value and provide a globalFilterFn that checks whether each row matches.',
    },
    {
      question: 'Does this work with server pagination?',
      answer:
        'Yes; enable manual filtering and send the validated builder data with each request.',
    },
  ],
};
