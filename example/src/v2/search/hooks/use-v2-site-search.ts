import * as React from 'react';
import type { ISiteSearchResult } from '../../../components/search/types/site-search-result';
import { v2SearchDocuments } from '../constants/v2-search-documents';
import { createV2SearchIndex } from '../utils/create-v2-search-index.util';
import { searchV2Index } from '../utils/search-v2-index.util';

export const useV2SiteSearch = (query: string): ISiteSearchResult[] => {
  const searchIndex = React.useMemo(
    () => createV2SearchIndex(v2SearchDocuments),
    []
  );

  return React.useMemo(
    () => searchV2Index(searchIndex, query),
    [query, searchIndex]
  );
};
