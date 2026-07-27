import type { IRecipePage } from './i-recipe-page';

export interface IRecipeGroup {
  key: string;
  title: string;
  pages: IRecipePage[];
}
