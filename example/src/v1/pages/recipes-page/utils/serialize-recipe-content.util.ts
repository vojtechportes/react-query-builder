import type { IRecipePage } from '../types/recipe-page';

export const serializeRecipeContent = ({
  demoLoader: _demoLoader,
  ...content
}: IRecipePage) => JSON.stringify(content);
