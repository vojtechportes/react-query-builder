import type { IRecipePage } from '../types/recipe-page';
import snippetSource from '../snippets/react-hook-form-query-builder.snippet.tsx?raw';

export const reactHookFormQueryBuilderRecipe: IRecipePage = {
  path: '/recipes/react-hook-form-query-builder',
  demoLoader: () => import('../demos/react-hook-form-query-builder.demo'),
  title: 'React Hook Form Query Builder Integration',
  summary:
    'Treat the query as a form field with validation, change tracking, submission, and reset.',
  description:
    'Integrate React Query Builder with React Hook Form for validated query state, change tracking, submission, and reliable resets.',
  groupKey: 'integrations',
  primaryKeyword: 'React Hook Form query builder',
  secondaryKeywords: ['filter form React', 'query builder form validation'],
  searchText:
    'React Hook Form Controller useForm dirty reset submit controlled builder',
  relatedRecipePaths: [
    '/recipes/save-load-filter-presets',
    '/recipes/persist-filters-in-url',
  ],
  relatedDocPaths: [
    '/documentation/usage',
    '/documentation/validation',
    '/api/builder',
  ],
  externalReferences: [
    {
      label: 'React Hook Form Controller',
      href: 'https://react-hook-form.com/docs/usecontroller/controller',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder react-hook-form`,
  fieldsCode: `type FilterForm = { name: string; query: DenormalizedQuery };

const fields: IBuilderFieldProps[] = [
  { field: 'email', label: 'Email', type: 'TEXT' },
  { field: 'createdAt', label: 'Created', type: 'DATE' },
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
  transformTitle: 'Submit the filter form',
  transformCode: `const saveFilter = ({ name, query }: FilterForm) =>
  fetch('/api/filter-presets', {
    method: 'POST',
    body: JSON.stringify({ name, query }),
  });`,
  capabilities: [
    'Query data participates in form validation and change tracking.',
    'Submit and reset use the same default values.',
    'Builder validation remains visible beside form errors.',
  ],
  safetyNotes: [
    'Validate submitted query data again when it reaches your API.',
    'Client-side validation only checks the form values. Your server must still decide what the user is allowed to access.',
  ],
  productionNotes: [
    'Keep defaultValues stable and call reset after a successful save.',
    'Do not copy the same form value into a separate useState. Let Controller manage it.',
  ],
  faqs: [
    {
      question: 'Why use Controller instead of register?',
      answer:
        'Builder does not behave like a native text input. Controller passes its value and changes to React Hook Form for you.',
    },
    {
      question: 'Will React Hook Form reset update Builder too?',
      answer:
        'Yes, as long as Builder receives its value from Controller. React Hook Form restores defaultValues and passes the restored filter back to Builder.',
    },
  ],
};
