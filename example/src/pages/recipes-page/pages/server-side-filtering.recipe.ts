import type { IRecipePage } from '../types/i-recipe-page';

export const serverSideFilteringRecipe: IRecipePage = {
  path: '/recipes/server-side-filtering',
  demoLoader: () => import('../demos/server-side-filtering.demo'),
  title: 'Server-side Filtering with React Query Builder',
  summary:
    'Send filter rules to an API, validate them, and return matching rows.',
  description:
    'Implement server-side filtering with checks for incoming filter data, page-size limits, and access rules enforced by the server.',
  groupKey: 'state-backend',
  primaryKeyword: 'server-side filtering React',
  secondaryKeywords: ['query builder API', 'backend filter validation'],
  searchText:
    'server API contract mocked backend validate allowlist pagination tenant authorization',
  relatedRecipePaths: [
    '/recipes/prisma-filter-ui',
    '/recipes/ai-assisted-filter-creation',
  ],
  relatedDocPaths: [
    '/documentation/validation',
    '/documentation/locking-and-read-only',
    '/api/builder',
  ],
  illustrative: true,
  installCode: `npm install @vojtechportes/react-query-builder`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'status', label: 'Status', type: 'LIST', value: statuses },
  { field: 'amount', label: 'Amount', type: 'NUMBER' },
];

const initialQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];`,
  builderCode: `const [query, setQuery] = useState(initialQuery);
const [rows, setRows] = useState<Order[]>([]);

const search = async () => {
  const response = await fetch('/api/orders/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, page: 1, pageSize: 50 }),
  });

  setRows((await response.json()).rows);
};

return (
  <>
    <Builder fields={fields} data={query} onChange={setQuery} />
    <button onClick={search}>Search</button>
    <Results rows={rows} />
  </>
);`,
  transformTitle: 'Validate the API request',
  transformCode: `// Example server handler: this code does not run on the static site.
const request = validateSearchRequest(await req.json(), {
  allowedFields: ['status', 'amount'],
  allowedOperators: ['EQUAL', 'LARGER_EQUAL'],
  maxDepth: 4,
  maxRules: 20,
  maxPageSize: 100,
});

const scopedQuery = addRequiredScope(request.query, {
  tenantId: session.tenantId,
  userId: session.userId,
});

return Response.json(await orderService.search(scopedQuery, request.page));`,
  capabilities: [
    'A predictable request and response format.',
    'Backend validation demonstrated with a replaceable mock API.',
    'Each request includes a page number and page size, and limits how complex the filter can be.',
  ],
  safetyNotes: [
    'Treat every filter sent by the browser as untrusted. It must never decide which records a user is allowed to access.',
    'Check supported fields, operators, and value types, and reject filters that are too large or deeply nested.',
    'Always add user or organization access rules on the server.',
  ],
  productionNotes: [
    'Return structured validation errors without echoing secrets.',
    'Log rejected filter shape and request ids, not sensitive values.',
  ],
  faqs: [
    {
      question: 'What should the server check before applying a filter?',
      answer:
        'Check every field, operator, and value. Also reject filters with too many nested groups or rules, and requests outside your pagination limits.',
    },
    {
      question: 'Is a locked rule enough to protect restricted records?',
      answer:
        'No. A locked rule can explain the filter in the UI, but the server must still decide which records the user can access.',
    },
  ],
};
