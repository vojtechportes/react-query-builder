import type MiniSearch from 'minisearch';
import type { ISiteSearchResult } from '../../../components/search/types/site-search-result';
import type { IV1SearchDocument } from '../types/v1-search-document';

export const searchV1Index = (
  searchIndex: MiniSearch<IV1SearchDocument>,
  query: string
): ISiteSearchResult[] => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return searchIndex.search(trimmedQuery, {
    combineWith: 'AND',
  }) as unknown as ISiteSearchResult[];
};
