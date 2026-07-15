import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/export-to-prisma-where-clause.snippet.tsx?raw';

export const exportToPrismaWhereClauseRecipe: IRecipePage = {
  path: '/recipes/export-to-prisma-where-clause',
  demoLoader: () => import('../demos/export-to-prisma-where-clause.demo'),
  title: 'Export to a Prisma Where Clause',
  summary:
    'Format an existing builder query as a Prisma filter.',
  description:
    'Export existing React Query Builder data to a Prisma where clause with formatQuery, typed fields, expected output, and backend validation notes.',
  groupKey: 'parsing-export',
  primaryKeyword: 'export to Prisma where clause',
  secondaryKeywords: ['Prisma query formatter', 'React filter to Prisma'],
  searchText:
    'Prisma formatQuery wrapWhereClause concise formatter equals gte where input',
  relatedRecipePaths: [
    '/recipes/prisma-filter-ui',
    '/recipes/export-to-mongodb-query',
  ],
  relatedDocPaths: [
    '/api/format-query',
    '/documentation/parsing-and-formatting/supported-formats',
    '/api/fields',
  ],
  externalReferences: [
    {
      label: 'Prisma Client filtering',
      href: 'https://www.prisma.io/docs/orm/prisma-client/queries/crud#filter-records',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder

import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'status', label: 'Status', type: 'TEXT' },
  { field: 'total', label: 'Total', type: 'NUMBER' },
];

const query: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      { field: 'status', operator: 'EQUAL', value: 'PAID' },
      { field: 'total', operator: 'LARGER_EQUAL', value: 100 },
    ],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Format the Prisma filter',
  transformCode: `const result = formatQuery(data, 'Prisma', {
  fields,
  wrapWhereClause: true,
});`,
  expectedOutput: `{
  "where": {
    "AND": [{ "status": { "equals": "PAID" } }, { "total": { "gte": 100 } }]
  }
}`,
  capabilities: [
    'A short example that converts existing Builder data.',
    'Prisma where wrapper output.',
    'A focused conversion example for apps that already have a filter UI.',
  ],
  safetyNotes: [
    'Validate and rebuild filters on the server before passing them to Prisma.',
    'Add filters for the current user or organization on the server; never accept those filters from the browser.',
  ],
  productionNotes: [
    'Keep application fields mapped to exact Prisma model fields.',
    'Test related records, empty values, and lists used by your Prisma schema.',
  ],
  faqs: [
    {
      question: 'What if a Builder operator has no Prisma equivalent?',
      answer:
        'Support only the operators your app can convert. Show a validation message for unsupported operators instead of creating an incomplete where object.',
    },
    {
      question: 'Where should the Prisma where object be created?',
      answer:
        'Create and check it on the server before passing it to Prisma Client. A browser preview is useful for learning, but it should not run the database query.',
    },
  ],
};
