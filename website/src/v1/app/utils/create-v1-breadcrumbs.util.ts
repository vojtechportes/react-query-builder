import type { IV1Breadcrumb } from '../types/v1-breadcrumb';
import { createV1PublicPath } from './create-v1-public-path.util';

export const createV1Breadcrumbs = (
  path: string,
  titlesByPath: ReadonlyMap<string, string>
): IV1Breadcrumb[] => {
  const segments = path.split('/').filter(Boolean);
  const paths = [
    '/',
    ...segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`),
  ];

  return paths.map((breadcrumbPath) => ({
    label: titlesByPath.get(breadcrumbPath) ?? breadcrumbPath,
    path: breadcrumbPath,
    publicPath: createV1PublicPath(breadcrumbPath),
  }));
};
