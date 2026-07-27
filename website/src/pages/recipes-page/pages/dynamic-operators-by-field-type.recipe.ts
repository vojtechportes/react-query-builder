import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/dynamic-operators-by-field-type.snippet.tsx?raw';

export const dynamicOperatorsByFieldTypeRecipe: IRecipePage = {
  path: '/recipes/dynamic-operators-by-field-type',
  demoLoader: () => import('../demos/dynamic-operators-by-field-type.demo'),
  title: 'Dynamic Query Operators by Field Type',
  summary:
    'Choose suitable operators and inputs for text, number, date, yes/no, list, empty-value, and field-to-field comparisons.',
  description:
    'Configure React Query Builder so each field shows suitable operators and inputs for text, numbers, dates, yes/no values, lists, empty-value checks, and field comparisons.',
  groupKey: 'advanced',
  primaryKeyword: 'dynamic operators by field type',
  secondaryKeywords: [
    'query builder field operators',
    'React dynamic filter fields',
  ],
  searchText:
    'text number date boolean enum nullable field comparison comparableFields operators value options',
  relatedRecipePaths: [
    '/recipes/server-side-filtering',
    '/recipes/ai-assisted-filter-creation',
  ],
  relatedDocPaths: [
    '/documentation/dynamic-field-options',
    '/documentation/field-comparisons',
    '/api/fields',
  ],
  installCode: `npm install @vojtechportes/react-query-builder`,
  fieldsCode: `import type {
  DenormalizedQuery,
  IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
];

const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS', 'IS_NULL'],
  },
  {
    field: 'amount',
    label: 'Amount',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER', 'BETWEEN'],
  },
  {
    field: 'createdAt',
    label: 'Created',
    type: 'DATE',
    operators: ['EQUAL', 'SMALLER', 'LARGER'],
  },
  { field: 'active', label: 'Active', type: 'BOOLEAN' },
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: statusOptions,
    operators: ['EQUAL', 'NOT_EQUAL', 'IN'],
  },
  {
    field: 'approvedAmount',
    label: 'Approved amount',
    type: 'NUMBER',
    fieldComparison: { type: 'number', comparableFields: ['amount'] },
  },
];

const initialQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];`,
  builderCode: snippetSource,
  transformTitle: 'Update list options while the app is running',
  transformCode: `const builderRef = useBuilderRef();
builderRef.current?.setFieldOptions('status', statusOptions);
// Pass builderRef to <Builder ref={builderRef} />.`,
  capabilities: [
    'Operators that match each field data type.',
    'Static lists plus options that can change for a field or individual rule.',
    'Optional comparisons between compatible fields.',
  ],
  safetyNotes: [
    'Your server should check that each field is used only with supported operators.',
    'Treat hidden or disabled UI choices as presentation, not access control.',
  ],
  productionNotes: [
    'Define how your application treats null and empty values.',
    'Clear or replace values that are no longer valid when available options change.',
  ],
  faqs: [
    {
      question: 'What happens when a user changes the field in an existing rule?',
      answer:
        'Check whether the current operator and value still work with the new field. Clear or replace them when they do not.',
    },
    {
      question: 'Can the value options depend on another field?',
      answer:
        'Yes. Update the available options when the related field changes, then clear or replace values that are no longer valid.',
    },
  ],
};
