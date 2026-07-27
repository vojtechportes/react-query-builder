import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/prisma-filter-ui.snippet.tsx?raw';

export const prismaFilterUiRecipe: IRecipePage = {
  path: '/recipes/prisma-filter-ui',
  demoLoader: () => import('../demos/prisma-filter-ui.demo'),
  title: 'Build a Prisma Filter UI with React Query Builder',
  summary:
    'Build a product filter and preview the Prisma where object before validating it on your server.',
  description:
    'Build a Prisma filter UI in React with field definitions, editable rules, a Prisma where-clause preview, and server-side validation guidance.',
  groupKey: 'integrations',
  primaryKeyword: 'Prisma filter UI',
  secondaryKeywords: ['React Prisma query builder', 'Prisma where filter'],
  searchText:
    'Prisma product catalog controlled form where AND server validation',
  relatedRecipePaths: [
    '/recipes/export-to-prisma-where-clause',
    '/recipes/server-side-filtering',
  ],
  relatedDocPaths: [
    '/documentation/usage',
    '/api/format-query',
    '/documentation/validation',
  ],
  externalReferences: [
    {
      label: 'Prisma Client filtering',
      href: 'https://www.prisma.io/docs/orm/prisma-client/queries/crud#filter-records',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder

import { Builder } from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';`,
  fieldsCode: `import type {
  DenormalizedQuery,
  IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

export const fields: IBuilderFieldProps[] = [
  {
    field: 'category',
    label: 'Category',
    type: 'LIST',
    value: [
      { label: 'Books', value: 'BOOKS' },
      { label: 'Games', value: 'GAMES' },
    ],
  },
  { field: 'price', label: 'Price', type: 'NUMBER' },
  { field: 'inStock', label: 'In stock', type: 'BOOLEAN' },
];

export const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'inStock', operator: 'EQUAL', value: true }],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Export the Prisma where input',
  transformCode: `const where = formatQuery(query, 'Prisma', {
  fields,
  wrapWhereClause: true,
});`,
  expectedOutput: `{ "where": { "AND": [{ "inStock": { "equals": true } }] } }`,
  capabilities: [
    'A product filter with list, number, and yes/no fields.',
    'Filter rules that users can review before sending them.',
    'A clear separation between browser filter state and server-side Prisma execution.',
  ],
  safetyNotes: [
    'Treat the browser-produced object as untrusted input.',
    'On the server, accept only supported fields and operators, then validate value types and query depth.',
    'On the server, add filters that restrict records to the current user or organization.',
  ],
  productionNotes: [
    'Wait briefly after the user stops editing before updating expensive previews, and require a Submit action for expensive searches.',
    'Keep Prisma Client and database credentials on the server.',
  ],
  faqs: [
    {
      question: 'Where should the Prisma query run?',
      answer:
        'On the server. Send the Builder data to your API, check it there, and then create and run the Prisma query.',
    },
    {
      question: 'Can users change a required filter, such as their organization ID?',
      answer:
        'You can lock the rule in the UI, but the server must add or verify required filters because browser data can be changed.',
    },
  ],
};
