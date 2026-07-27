import { recipes } from '../pages/recipes-content';

export const findRecipePage = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return recipes.find((page) => page.path === normalizedPath);
};
