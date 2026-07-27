import type { IV2RouteRecord } from '../../app/types/v2-route-record';
import type { IV2SearchDocument } from '../types/v2-search-document';
import type { IV2SearchPage } from '../types/v2-search-page';

export const createV2SearchDocuments = (
  pages: readonly IV2SearchPage[],
  routeManifest: readonly IV2RouteRecord[]
): IV2SearchDocument[] => {
  const routesByPath = new Map(
    routeManifest.map((route) => [route.path, route])
  );

  return pages.map((page) => {
    const route = routesByPath.get(page.path);

    if (!route) {
      throw new Error(
        `Cannot index v2 search page without a v2 route: ${page.path}`
      );
    }

    return {
      id: page.path,
      title: page.title,
      path: route.path,
      publicPath: route.publicPath,
      summary: page.summary,
      content: `${page.title} ${page.summary} ${page.searchText}`,
    };
  });
};
