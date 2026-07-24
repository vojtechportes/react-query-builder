import type { IV1RouteRecord } from '../../app/types/v1-route-record';
import type { IV1SearchDocument } from '../types/v1-search-document';
import type { IV1SearchPage } from '../types/v1-search-page';

export const createV1SearchDocuments = (
  pages: readonly IV1SearchPage[],
  routeManifest: readonly IV1RouteRecord[]
): IV1SearchDocument[] => {
  const routesByPath = new Map(
    routeManifest.map((route) => [route.path, route])
  );

  return pages.map((page) => {
    const route = routesByPath.get(page.path);

    if (!route) {
      throw new Error(
        `Cannot index v1 search page without a v1 route: ${page.path}`
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
