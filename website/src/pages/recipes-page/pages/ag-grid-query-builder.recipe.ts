import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/ag-grid-query-builder.snippet.tsx?raw';

export const agGridQueryBuilderRecipe: IRecipePage = {
  path: '/recipes/ag-grid-query-builder',
  demoLoader: () => import('../demos/ag-grid-query-builder.demo'),
  title: 'Build an AG Grid Query Builder Filter Panel',
  summary:
    'Use an external panel to build nested filters for AG Grid.',
  description:
    'Use React Query Builder as an external AG Grid filter panel, then translate its nested rules into AG Grid filtering callbacks.',
  groupKey: 'integrations',
  primaryKeyword: 'AG Grid query builder',
  secondaryKeywords: ['AG Grid advanced filter', 'React grid filter panel'],
  searchText:
    'AG Grid external filter isExternalFilterPresent doesExternalFilterPass nested rules',
  relatedRecipePaths: [
    '/recipes/mui-datagrid-advanced-filtering',
    '/recipes/server-side-filtering',
  ],
  relatedDocPaths: [
    '/documentation/components',
    '/documentation/usage',
    '/api/data',
  ],
  externalReferences: [
    {
      label: 'AG Grid external filtering',
      href: 'https://www.ag-grid.com/javascript-data-grid/filter-external/',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder ag-grid-react ag-grid-community`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'athlete', label: 'Athlete', type: 'TEXT' },
  { field: 'age', label: 'Age', type: 'NUMBER' },
  { field: 'country', label: 'Country', type: 'TEXT' },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'age', operator: 'LARGER_EQUAL', value: 18 }],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Evaluate the external filter',
  transformCode: `const matchesQuery = (row: Athlete, query: DenormalizedQuery) =>
  evaluateGroup(query[0], (rule) =>
    compare(row[rule.field], rule.operator, rule.value)
  );`,
  capabilities: [
    'An external panel for building advanced AG Grid filters.',
    'A small conversion function applies nested AND/OR rules to each row.',
    'The same filter data can be sent to your server when rows are not loaded in the browser.',
  ],
  safetyNotes: [
    'Browser-side filtering only hides rows; it does not control which rows a user is allowed to access.',
    'For server-side row models, validate field names, operators, values, group depth, and page limits.',
  ],
  productionNotes: [
    'Rebuild the row-matching function only when the filter changes.',
    'For large datasets, validate and apply the query on the server instead of scanning rows in the browser.',
  ],
  faqs: [
    {
      question: 'Can I use Builder together with AG Grid column filters?',
      answer:
        'Yes. Decide whether rows must match both filters or only one of them, then apply that rule consistently.',
    },
    {
      question: 'When should filtering move to the server?',
      answer:
        'Use server filtering when the dataset is too large to load in the browser or contains records the current user should not receive.',
    },
  ],
};
