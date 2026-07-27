import MiniSearch from 'minisearch';
import type { IV2SearchDocument } from '../types/v2-search-document';

export const createV2SearchIndex = (
  documents: readonly IV2SearchDocument[]
): MiniSearch<IV2SearchDocument> => {
  const searchIndex = new MiniSearch<IV2SearchDocument>({
    fields: ['title', 'content'],
    storeFields: ['title', 'path', 'publicPath', 'summary'],
    searchOptions: {
      boost: { title: 3 },
      fuzzy: 0.15,
      prefix: true,
    },
  });

  searchIndex.addAll([...documents]);

  return searchIndex;
};
