import type { IRecipePage } from '../types/i-recipe-page';
import snippetSource from '../snippets/save-load-filter-presets.snippet.tsx?raw';

export const saveLoadFilterPresetsRecipe: IRecipePage = {
  path: '/recipes/save-load-filter-presets',
  demoLoader: () => import('../demos/save-load-filter-presets.demo'),
  title: 'Save and Load React Filter Presets',
  summary:
    'Persist named, versioned filters and safely restore, rename, or delete them.',
  description:
    'Save and load reusable React filter presets with versioned query data, validation, rename and reset flows, and safe API boundaries.',
  groupKey: 'state-backend',
  primaryKeyword: 'save filter presets',
  secondaryKeywords: ['load query builder filters', 'reusable React filters'],
  searchText:
    'preset save load rename delete version migration local storage API',
  relatedRecipePaths: [
    '/recipes/persist-filters-in-url',
    '/recipes/react-hook-form-query-builder',
  ],
  relatedDocPaths: [
    '/documentation/validation',
    '/documentation/history',
    '/api/data',
  ],
  installCode: `npm install @vojtechportes/react-query-builder`,
  fieldsCode: `interface IFilterPreset {
  id: string;
  name: string;
  version: 1;
  query: DenormalizedQuery;
}

const fields: IBuilderFieldProps[] = [
  { field: 'region', label: 'Region', type: 'LIST', value: regions },
  { field: 'revenue', label: 'Revenue', type: 'NUMBER' },
];

const emptyQuery: DenormalizedQuery = [
  { type: 'GROUP', value: 'AND', isNegated: false, children: [] },
];`,
  builderCode: snippetSource,
  transformTitle: 'Save a versioned preset',
  transformCode: `const payload = { name: name.trim(), version: 1 as const, query };
await fetch('/api/filter-presets', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});`,
  capabilities: [
    'Named filters users can save, load, rename, and delete.',
    'A version field for future migrations.',
    'Validation before restored data reaches the builder.',
  ],
  safetyNotes: [
    'Check preset ownership every time a preset is read or changed.',
    'Accept only supported fields and operators. Reject presets with too many nested groups or unusually large values.',
  ],
  productionNotes: [
    'If the UI shows a new name before the server confirms it, restore the old name when the request fails.',
    'Define explicit migrations for old versions instead of guessing their structure.',
  ],
  faqs: [
    {
      question: 'Should presets store formatted SQL?',
      answer:
        'Prefer builder data so it remains editable and can be formatted for different targets.',
    },
    {
      question: 'Can localStorage be used?',
      answer:
        'Yes for presets saved on one device, but validate browser storage just like server data.',
    },
  ],
};
