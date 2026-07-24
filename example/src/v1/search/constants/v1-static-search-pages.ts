import type { IV1SearchPage } from '../types/v1-search-page';

export const v1StaticSearchPages: IV1SearchPage[] = [
  {
    path: '/',
    title: 'Home',
    summary:
      'Highly configurable TypeScript library for nested filter editors, query formatting, and query parsing.',
    searchText:
      'Home highly configurable typescript library nested filter editors query formatting query parsing demo documentation react query builder',
  },
  {
    path: '/demo',
    title: 'Demo',
    summary:
      'Interactive builder demo with control toggles, theme editing, and output previews.',
    searchText:
      'Demo interactive builder controls readOnly draggable singleRootGroup output formats theme editor',
  },
  {
    path: '/recipes',
    title: 'Recipes',
    summary:
      'Practical React Query Builder integrations, backend workflows, parsing, exports, and advanced patterns.',
    searchText:
      'Recipes integrations backend workflows parsing export advanced patterns React Query Builder',
  },
];
