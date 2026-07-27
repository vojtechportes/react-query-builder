import type { IRecipePage } from '../types/recipe-page';

export const aiAssistedFilterCreationRecipe: IRecipePage = {
  path: '/recipes/ai-assisted-filter-creation',
  demoLoader: () => import('../demos/ai-assisted-filter-creation.demo'),
  title: 'Experimental AI-assisted Filter Creation',
  summary:
    'Turn natural language into a draft query, validate it, preview it, and require user confirmation.',
  description:
    'Build an experimental AI-assisted filter flow that turns natural language into draft rules, checks their structure, and asks the user to confirm them.',
  groupKey: 'advanced',
  primaryKeyword: 'AI-assisted filter creation',
  secondaryKeywords: ['natural language query builder', 'AI React filters'],
  searchText:
    'experimental AI natural language draft schema validation allowlist human review confirmation apply',
  relatedRecipePaths: [
    '/recipes/dynamic-operators-by-field-type',
    '/recipes/server-side-filtering',
  ],
  relatedDocPaths: [
    '/documentation/validation',
    '/api/data',
    '/documentation/locking-and-read-only',
  ],
  illustrative: true,
  installCode: `npm install @vojtechportes/react-query-builder
# Add the server-side AI SDK and validation library used by your app.`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: statuses,
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'total',
    label: 'Total',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];

const emptyQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];`,
  builderCode: `const [applied, setApplied] = useState(emptyQuery);
const [draft, setDraft] = useState<DenormalizedQuery>();

const generateDraft = async (prompt: string) =>
  setDraft(validateAiDraft(await requestDraft(prompt), fields));

return (
  <>
    <PromptForm onGenerate={generateDraft} />
    {draft && (
      <>
        <Builder
          fields={fields}
          data={draft}
          onChange={setDraft}
          showValidation
        />
        <button
          onClick={() => {
            setApplied(draft);
            setDraft(undefined);
          }}
        >
          Confirm and apply
        </button>
      </>
    )}
    <Results query={applied} />
  </>
);`,
  transformTitle: 'Validate the model response before preview',
  transformCode: `// Run on your server, then validate again in the client.
const draft = filterSchema.parse(modelJson);
assertAllowedFieldsAndOperators(draft, allowedSchema);
return { draft, warnings: explainDraft(draft) };
// Never auto-apply: show the editable draft and require confirmation.`,
  capabilities: [
    'Natural-language input produces a draft, not an active filter.',
    'Only supported fields and operators pass validation before rendering.',
    'Editable preview plus explicit human confirmation.',
  ],
  safetyNotes: [
    'Experimental: model output is untrusted and may be incorrect or adversarial.',
    'Keep AI credentials on the server and validate every generated field, operator, and value.',
    'Check what the user is allowed to access separately, and require confirmation before applying a generated filter.',
  ],
  productionNotes: [
    'Show a plain-language explanation and warnings with the draft.',
    'If you collect edits or outcomes, get user consent and avoid storing sensitive prompts by default.',
  ],
  faqs: [
    {
      question: 'Should an AI-created filter run immediately?',
      answer:
        'No. Check it first, show it as an editable draft, and let the user confirm it.',
    },
    {
      question: 'What if the AI returns an unsupported field or operator?',
      answer:
        'Reject that part of the filter and show a clear error. Only accept fields and operators provided by your application.',
    },
    {
      question: 'Do I need a specific AI provider?',
      answer:
        'No. The Builder only needs valid filter data. Your backend can create that data with any provider or SDK.',
    },
  ],
};
