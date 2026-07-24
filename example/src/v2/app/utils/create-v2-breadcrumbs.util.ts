import type { IV2Breadcrumb } from '../types/v2-breadcrumb';
import { createV2PublicPath } from './create-v2-public-path.util';

export const createV2Breadcrumbs = (
  path: string,
  titlesByPath: ReadonlyMap<string, string>
): IV2Breadcrumb[] => {
  const segments = path.split('/').filter(Boolean);
  const paths = [
    '/',
    ...segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`),
  ];

  return paths.map((breadcrumbPath) => ({
    label: titlesByPath.get(breadcrumbPath) ?? breadcrumbPath,
    path: breadcrumbPath,
    publicPath: createV2PublicPath(breadcrumbPath),
  }));
};
