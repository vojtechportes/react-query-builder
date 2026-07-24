import { v1SeoPages } from '../constants/v1-seo-pages';
import type { IV1SeoPage } from '../types/v1-seo-page';
import { normalizeV1SeoPath } from './normalize-v1-seo-path.util';

export const findV1SeoPage = (pathname: string): IV1SeoPage => {
  const normalizedPath = normalizeV1SeoPath(pathname);
  const page = v1SeoPages.find(({ path }) => path === normalizedPath);

  if (!page) {
    throw new Error(`Missing v1 SEO page for route: ${normalizedPath}`);
  }

  return page;
};
