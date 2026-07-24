import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const cloneRecipeQuery = (query: DenormalizedQuery): DenormalizedQuery =>
  structuredClone(query);
