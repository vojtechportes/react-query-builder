import * as React from 'react';
import type { ISiteSearchResult } from '../../../components/search/types/site-search-result';
import { v1SearchDocuments } from '../constants/v1-search-documents';
import { createV1SearchIndex } from '../utils/create-v1-search-index.util';
import { searchV1Index } from '../utils/search-v1-index.util';

export const useV1SiteSearch = (query: string): ISiteSearchResult[] => {
  const searchIndex = React.useMemo(
    () => createV1SearchIndex(v1SearchDocuments),
    []
  );

  return React.useMemo(
    () => searchV1Index(searchIndex, query),
    [query, searchIndex]
  );
};
