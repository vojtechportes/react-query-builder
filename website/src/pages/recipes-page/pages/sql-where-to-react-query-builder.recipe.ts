import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/sql-where-to-react-query-builder.snippet.tsx?raw';

export const sqlWhereToReactQueryBuilderRecipe: IRecipePage = {
  path: '/recipes/sql-where-to-react-query-builder',
  demoLoader: () => import('../demos/sql-where-to-react-query-builder.demo'),
  title: 'Convert SQL WHERE to React Query Builder Data',
  summary:
    'Parse a SQL WHERE clause into editable typed fields and nested builder data.',
  description:
    'Convert a SQL WHERE clause to React Query Builder data with parseQuery, review the detected fields, validate the result, and render it for editing.',
  groupKey: 'parsing-export',
  primaryKeyword: 'SQL WHERE to React Query Builder',
  secondaryKeywords: ['parse SQL filter React', 'SQL query parser TypeScript'],
  searchText:
    'parseQuery SQL WHERE import inferred fields editable visual rules',
  relatedRecipePaths: [
    '/recipes/export-to-mongodb-query',
    '/recipes/export-to-prisma-where-clause',
  ],
  relatedDocPaths: [
    '/api/parse-query',
    '/documentation/parsing-and-formatting',
    '/api/data',
  ],
  installCode: `npm install @vojtechportes/react-query-builder

import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';`,
  fieldsCode: `const sql = "WHERE status = 'PAID' AND total >= 100";
const parsed = parseQuery(sql.replace(/^WHERE\\s+/i, ''), 'SQL');
const fields: IBuilderFieldProps[] = parsed.fields;
const initialQuery: DenormalizedQuery = parsed.data;`,
  builderCode: snippetSource,
  transformTitle: 'Parse and inspect the result',
  transformCode: `const sql = "WHERE status = 'PAID' AND total >= 100";
const result = parseQuery(sql.replace(/^WHERE\\s+/i, ''), 'SQL');
console.log(result.fields);
console.log(result.data);`,
  expectedOutput: `[
  {
    "type": "GROUP",
    "value": "AND",
    "isNegated": false,
    "children": [
      { "field": "status", "operator": "EQUAL", "value": "PAID" },
      { "field": "total", "operator": "LARGER_EQUAL", "value": 100 }
    ]
  }
]`,
  capabilities: [
    'SQL import that turns an existing WHERE clause into editable filters.',
    'Detected fields that you can replace with definitions from your application.',
    'Nested filter data ready to display in the Builder.',
  ],
  safetyNotes: [
    'Parsing does not make SQL safe to execute.',
    'Use query parameters provided by your database library instead of inserting values directly into SQL strings. Accept only supported fields and operators on the server.',
  ],
  productionNotes: [
    'Replace the detected field labels and types with definitions from your schema.',
    'Show parse errors and keep the previous valid query while users correct input.',
  ],
  faqs: [
    {
      question: 'What happens when the SQL contains unsupported syntax?',
      answer:
        'Do not replace the current filter. Show a clear error and let the user edit the SQL or return to the visual Builder.',
    },
    {
      question: 'Can imported SQL be sent directly to the database?',
      answer:
        'No. Check the parsed filter on the server and use query parameters when creating the database query. Never insert pasted SQL directly into a query string.',
    },
  ],
};
