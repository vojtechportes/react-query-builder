import { v2SeoPages } from '../constants/v2-seo-pages';
import type { IV2SeoPage } from '../types/v2-seo-page';
import { normalizeV2SeoPath } from './normalize-v2-seo-path.util';

export const findV2SeoPage = (pathname: string): IV2SeoPage => {
  const normalizedPath = normalizeV2SeoPath(pathname);
  const page = v2SeoPages.find(({ path }) => path === normalizedPath);

  if (!page) {
    throw new Error(`Missing v2 SEO page for route: ${normalizedPath}`);
  }

  return page;
};
