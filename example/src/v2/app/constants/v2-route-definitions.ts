import { apiPages } from '../../pages/api-page/constants/api-pages';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV2RouteDefinition } from '../types/v2-route-definition';

export const v2RouteDefinitions: IV2RouteDefinition[] = [
  { path: '/', title: 'Home', section: 'Home' },
  ...documentationPages.map(({ path, title }) => ({
    path,
    title,
    section: 'Documentation' as const,
  })),
  ...apiPages.map(({ path, title }) => ({
    path,
    title,
    section: 'API' as const,
  })),
  { path: '/demo', title: 'Demo', section: 'Demo' },
  { path: '/recipes', title: 'Recipes', section: 'Recipes' },
  ...recipes.map(({ path, title }) => ({
    path,
    title,
    section: 'Recipes' as const,
  })),
];
