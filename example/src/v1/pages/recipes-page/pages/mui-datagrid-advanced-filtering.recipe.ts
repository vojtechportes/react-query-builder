import type { IRecipePage } from '../types/recipe-page';
import snippetSource from '../snippets/mui-datagrid-advanced-filtering.snippet.tsx?raw';

export const muiDataGridAdvancedFilteringRecipe: IRecipePage = {
  path: '/recipes/mui-datagrid-advanced-filtering',
  demoLoader: () => import('../demos/mui-datagrid-advanced-filtering.demo'),
  title: 'MUI DataGrid Advanced Filtering with React Query Builder',
  summary:
    'Style the Builder with MUI and convert its rules into the format DataGrid expects.',
  description:
    'Use the Material UI adapter to style React Query Builder, then convert its rules into the filter format used by MUI DataGrid.',
  groupKey: 'integrations',
  primaryKeyword: 'MUI DataGrid advanced filtering',
  secondaryKeywords: ['MUI query builder', 'React DataGrid filter builder'],
  searchText:
    'Material UI Data Grid filterModel items logicOperator toolbar external panel',
  relatedRecipePaths: [
    '/recipes/ag-grid-query-builder',
    '/recipes/tanstack-table-filtering',
  ],
  relatedDocPaths: [
    '/documentation/adapters/mui',
    '/api/adapters/mui',
    '/api/components',
  ],
  externalReferences: [
    {
      label: 'MUI DataGrid filtering',
      href: 'https://mui.com/x/react-data-grid/filtering/',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder @mui/material @emotion/react @emotion/styled
npm install @mui/x-data-grid

import { createMuiComponents } from '@vojtechportes/react-query-builder/mui/v9';`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'customer', label: 'Customer', type: 'TEXT' },
  { field: 'total', label: 'Order total', type: 'NUMBER' },
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: [
      { label: 'Open', value: 'OPEN' },
      { label: 'Paid', value: 'PAID' },
    ],
  },
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
  transformTitle: 'Translate rules to a DataGrid filter model',
  transformCode: `const toGridFilterModel = (query: DenormalizedQuery): GridFilterModel => ({
  logicOperator: GridLogicOperator.And,
  items: flattenRules(query).map((rule, index) => ({
    id: index,
    field: rule.field,
    operator: operatorMap[rule.operator],
    value: rule.value,
  })),
});`,
  expectedOutput: `{
  "logicOperator": "and",
  "items": [{ "field": "status", "operator": "is", "value": "PAID" }]
}`,
  capabilities: [
    'MUI-styled builder controls next to a DataGrid.',
    'A conversion function maps Builder fields and operators to DataGrid.',
    'One React state value can drive filtering in the browser or on the server.',
  ],
  safetyNotes: [
    'DataGrid filter models control the UI; they do not enforce data access.',
    'Validate remote-filter requests on the server before querying protected data.',
  ],
  productionNotes: [
    'Create the MUI components once, and use useMemo when converting filters for DataGrid.',
    'Choose how to handle nested groups because DataGrid may not represent them exactly.',
  ],
  faqs: [
    {
      question: 'Do I need to install MUI DataGrid separately?',
      answer:
        'Yes. The React Query Builder adapter provides MUI styling for Builder, but it does not include MUI DataGrid.',
    },
    {
      question: 'What happens to nested AND and OR groups?',
      answer:
        'MUI DataGrid cannot represent every nested combination in its filter model. Keep complex groups for server filtering, or clearly define how your app simplifies them.',
    },
  ],
};
