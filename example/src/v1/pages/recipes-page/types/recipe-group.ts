import type { IRecipePage } from './recipe-page';

export interface IRecipeGroup {
  key: string;
  title: string;
  pages: IRecipePage[];
}
