import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export interface IMockSearchRequest {
  query: DenormalizedQuery;
  page: number;
  pageSize: number;
}
