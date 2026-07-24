import type { IRecipePage } from '../types/recipe-page';
import snippetSource from '../snippets/persist-filters-in-url.snippet.tsx?raw';

export const persistFiltersInUrlRecipe: IRecipePage = {
  path: '/recipes/persist-filters-in-url',
  demoLoader: () => import('../demos/persist-filters-in-url.demo'),
  title: 'Persist React Filters in URL Query Parameters',
  summary:
    'Encode validated filter state in a shareable URL and restore it on navigation.',
  description:
    'Persist React Query Builder filters in URL query parameters, check decoded data before using it, update browser history, and create shareable links.',
  groupKey: 'state-backend',
  primaryKeyword: 'persist React filters in URL',
  secondaryKeywords: ['query builder URL state', 'shareable filter URL'],
  searchText:
    'URLSearchParams base64 encode decode history replaceState restore share link',
  relatedRecipePaths: [
    '/recipes/save-load-filter-presets',
    '/recipes/ai-assisted-filter-creation',
  ],
  relatedDocPaths: [
    '/documentation/usage',
    '/documentation/validation',
    '/api/data',
  ],
  externalReferences: [
    {
      label: 'MDN History API guide',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API',
    },
  ],
  installCode: `npm install @vojtechportes/react-query-builder

import { Builder, type DenormalizedQuery } from '@vojtechportes/react-query-builder';`,
  fieldsCode: `const fields: IBuilderFieldProps[] = [
  { field: 'status', label: 'Status', type: 'LIST', value: statusOptions },
  { field: 'owner', label: 'Owner', type: 'TEXT' },
];

const fallbackQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [],
  },
];`,
  builderCode: snippetSource,
  transformTitle: 'Decode and validate on page load',
  transformCode: `const readFilter = (search: string): DenormalizedQuery | undefined => {
  try {
    const value = new URLSearchParams(search).get('filter');
    return value ? validateFilter(JSON.parse(value)) : undefined;
  } catch {
    return undefined;
  }
};`,
  capabilities: [
    'Back/forward-friendly filter state.',
    'Shareable links with a safe fallback.',
    'A single decoder that can migrate older URL formats later.',
  ],
  safetyNotes: [
    'Treat URL data as untrusted and reject unknown fields, operators, excessive depth, and oversized values.',
    'Never put secrets or access-control rules in the URL.',
  ],
  productionNotes: [
    'Use replaceState while editing so every change does not add a browser-history entry. Use pushState when the user explicitly saves a search.',
    'Move large filters to saved server-side presets and keep only the preset ID in the URL.',
  ],
  faqs: [
    {
      question: 'Can every filter be stored in the URL?',
      answer:
        'URL length limits vary by browser. A large React Query Builder filter can exceed that limit, so be careful with this approach. For complex filters, store the filter elsewhere and put only its preset ID in the URL.',
    },
  ],
};
