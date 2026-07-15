import type { IRecipeGroup } from '../types/i-recipe-group';
import { recipes } from '../pages/recipes-content';

export const recipeGroups: IRecipeGroup[] = [
  {
    key: 'integrations',
    title: 'Framework and data integrations',
    pages: recipes.filter((page) => page.groupKey === 'integrations'),
  },
  {
    key: 'state-backend',
    title: 'State and backend workflows',
    pages: recipes.filter((page) => page.groupKey === 'state-backend'),
  },
  {
    key: 'parsing-export',
    title: 'Parsing and export',
    pages: recipes.filter((page) => page.groupKey === 'parsing-export'),
  },
  {
    key: 'advanced',
    title: 'Advanced patterns',
    pages: recipes.filter((page) => page.groupKey === 'advanced'),
  },
];
