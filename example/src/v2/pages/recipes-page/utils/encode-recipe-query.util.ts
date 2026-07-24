import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const encodeRecipeQuery = (query: DenormalizedQuery): string =>
  JSON.stringify(query);
