import type { IRecipeDataTableColumn } from './recipe-data-table-column';
import type { IRecipeDemoRow } from './recipe-demo-row';

export interface IRecipeDataTableProps {
  caption: string;
  columns: IRecipeDataTableColumn[];
  rows: IRecipeDemoRow[];
}
