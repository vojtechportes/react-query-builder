import { v1SeoConfig } from '../constants/v1-seo-config';
import { getV1SiteUrl } from './get-v1-site-url.util';
import { normalizeV1SeoPath } from './normalize-v1-seo-path.util';

export const createV1CanonicalUrl = (
  pathname: string,
  siteUrl = getV1SiteUrl()
): string => {
  const normalizedPath = normalizeV1SeoPath(pathname);
  const publicPath =
    normalizedPath === v1SeoConfig.versionPath ||
    normalizedPath.startsWith(`${v1SeoConfig.versionPath}/`)
      ? normalizedPath
      : `${v1SeoConfig.versionPath}${normalizedPath === '/' ? '' : normalizedPath}`;
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

  return new URL(publicPath.replace(/^\//, ''), normalizedSiteUrl).toString();
};
