import MiniSearch from 'minisearch';
import type { IV1SearchDocument } from '../types/v1-search-document';

export const createV1SearchIndex = (
  documents: readonly IV1SearchDocument[]
): MiniSearch<IV1SearchDocument> => {
  const searchIndex = new MiniSearch<IV1SearchDocument>({
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
