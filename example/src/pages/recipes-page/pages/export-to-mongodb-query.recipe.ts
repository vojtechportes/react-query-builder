import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/export-to-mongodb-query.snippet.tsx?raw';

export const exportToMongodbQueryRecipe: IRecipePage = {
  path: '/recipes/export-to-mongodb-query',
  demoLoader: () => import('../demos/export-to-mongodb-query.demo'),
  title: 'Export React Filters to a MongoDB Query',
  summary:
    'Preview visual filter rules as MongoDB query syntax before validating them on your server.',
  description:
    'Export React Query Builder filters to MongoDB query syntax with formatQuery, typed fields, expected output, and server-side safety guidance.',
  groupKey: 'parsing-export',
  primaryKeyword: 'export to MongoDB query',
  secondaryKeywords: [
    'MongoDB filter builder React',
    'React query to Mongo syntax',
  ],
  searchText:
    'Mongo formatQuery export $and $gte collection find allowlist injection',
  relatedRecipePaths: [
    '/recipes/export-to-prisma-where-clause',
    '/recipes/server-side-filtering',
  ],
  relatedDocPaths: [
    '/api/format-query',
    '/documentation/parsing-and-formatting/supported-formats',
    '/documentation/validation',
  ],
  externalReferences: [
    {
      label: 'MongoDB query documents',
      href: 'https://www.mongodb.com/docs/manual/tutorial/query-documents/',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder

import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'category', label: 'Category', type: 'TEXT' },
  { field: 'price', label: 'Price', type: 'NUMBER' },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      { field: 'category', operator: 'EQUAL', value: 'books' },
      { field: 'price', operator: 'LARGER_EQUAL', value: 20 },
    ],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Format MongoDB query syntax',
  transformCode: `const mongoQuery = formatQuery(query, 'Mongo', { fields });
await sendToTrustedApi({ query, preview: mongoQuery });`,
  expectedOutput: `{ "$and": [{ "category": { "$eq": "books" } }, { "price": { "$gte": 20 } }] }`,
  capabilities: [
    'A readable MongoDB export preview.',
    'Number fields stay as numbers in the generated query.',
    'Builder data sent to the backend for validation before formatting or execution.',
  ],
  safetyNotes: [
    'Do not run the MongoDB object created in the browser.',
    'On the server, rebuild the query using only fields and operators your application supports.',
    'Also check value types, limit query size, and add access rules on the server.',
  ],
  productionNotes: [
    'Send the original builder data to the server and format it only after validation.',
    'Decide how filters should handle empty values, arrays, and uppercase or lowercase text.',
  ],
  faqs: [
    {
      question: 'Where should the MongoDB query be checked and run?',
      answer:
        'On the server. Treat the browser output as input, check every field, operator, and value, then build and run the MongoDB query there.',
    },
    {
      question: 'What if a Builder operator has no MongoDB equivalent?',
      answer:
        'Support only the operators your app can convert. Show a validation message for the others instead of sending an incomplete query.',
    },
  ],
};
