import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const serializeNativeQuery = (query: DenormalizedQuery) =>
  JSON.stringify(query, null, 2);
