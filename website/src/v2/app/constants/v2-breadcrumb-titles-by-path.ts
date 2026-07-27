import { v2RouteDefinitions } from './v2-route-definitions';

export const v2BreadcrumbTitlesByPath = new Map(
  v2RouteDefinitions.map(({ path, title }) => [
    path,
    path === '/api'
      ? 'API'
      : path === '/documentation'
        ? 'Documentation'
        : title,
  ])
);
