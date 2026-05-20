import * as React from 'react';
import MiniSearch from 'minisearch';
import { apiPages } from '../pages/api-page/pages/api-content';
import { documentationPages } from '../pages/documentation-page/pages/documentation-content';

interface ISearchDocument {
  id: string;
  title: string;
  path: string;
  summary: string;
  content: string;
}

const searchDocuments: ISearchDocument[] = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    summary:
      'Highly configurable TypeScript library for nested filter editors, query formatting, and query parsing.',
    content:
      'Home highly configurable typescript library nested filter editors query formatting query parsing demo documentation react query builder',
  },
  {
    id: 'demo',
    title: 'Demo',
    path: '/demo',
    summary:
      'Interactive builder demo with control toggles, theme editing, and output previews.',
    content:
      'Demo interactive builder controls readOnly draggable singleRootGroup output formats theme editor',
  },
  ...documentationPages.map(page => ({
    id: page.path,
    title: page.title,
    path: page.path,
    summary: page.description,
    content: `${page.title} ${page.description} ${page.searchText}`,
  })),
  ...apiPages.map(page => ({
    id: page.path,
    title: page.title,
    path: page.path,
    summary: page.description,
    content: `${page.title} ${page.description} ${page.searchText}`,
  })),
];

export const useSiteSearch = (query: string) => {
  const miniSearch = React.useMemo(
    () => {
      const search = new MiniSearch<ISearchDocument>({
        fields: ['title', 'content'],
        storeFields: ['title', 'path', 'summary'],
        searchOptions: {
          boost: { title: 3 },
          fuzzy: 0.15,
          prefix: true,
        },
      });

      search.addAll(searchDocuments);

      return search;
    },
    []
  );

  return React.useMemo(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      return [];
    }

    return miniSearch.search(trimmed, {
      combineWith: 'AND',
    });
  }, [miniSearch, query]);
};
