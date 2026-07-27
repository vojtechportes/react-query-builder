import type MiniSearch from 'minisearch';
import type { ISiteSearchResult } from '../../../components/search/types/site-search-result';
import type { IV2SearchDocument } from '../types/v2-search-document';

export const searchV2Index = (
  searchIndex: MiniSearch<IV2SearchDocument>,
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
