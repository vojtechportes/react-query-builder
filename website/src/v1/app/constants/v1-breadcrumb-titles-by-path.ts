import { v1RouteDefinitions } from './v1-route-definitions';

export const v1BreadcrumbTitlesByPath = new Map(
  v1RouteDefinitions.map(({ path, title }) => [
    path,
    path === '/api'
      ? 'API'
      : path === '/documentation'
        ? 'Documentation'
        : title,
  ])
);
