import { apiPages } from '../../pages/api-page/constants/api-pages';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV1RouteDefinition } from '../types/v1-route-definition';

export const v1RouteDefinitions: IV1RouteDefinition[] = [
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
