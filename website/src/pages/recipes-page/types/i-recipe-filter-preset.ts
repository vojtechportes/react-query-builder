import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export interface IRecipeFilterPreset {
  id: string;
  name: string;
  version: 1;
  query: DenormalizedQuery;
}
