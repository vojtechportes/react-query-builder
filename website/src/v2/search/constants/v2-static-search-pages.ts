import type { IV2SearchPage } from '../types/v2-search-page';

export const v2StaticSearchPages: IV2SearchPage[] = [
  {
    path: '/',
    title: 'Home',
    summary:
      'Build nested filters visually in React and TypeScript, use SQL text mode, validate rules, and convert queries to supported formats.',
    searchText:
      'React Query Builder visual filter builder nested AND OR filters TypeScript SQL text mode validation parsing formatting MongoDB Prisma UI adapters',
  },
  {
    path: '/demo',
    title: 'Demo',
    summary:
      'Interactive playground for fields, adapters, validation, text editing, localization, and query output.',
    searchText:
      'Demo interactive playground fields adapters validation text editing localization query output theme controls',
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
