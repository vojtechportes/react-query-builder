import { v2SeoConfig } from '../constants/v2-seo-config';
import { getV2SiteUrl } from './get-v2-site-url.util';
import { normalizeV2SeoPath } from './normalize-v2-seo-path.util';

export const createV2CanonicalUrl = (
  pathname: string,
  siteUrl = getV2SiteUrl()
): string => {
  const normalizedPath = normalizeV2SeoPath(pathname);
  const publicPath =
    normalizedPath === v2SeoConfig.versionPath ||
    normalizedPath.startsWith(`${v2SeoConfig.versionPath}/`)
      ? normalizedPath
      : `${v2SeoConfig.versionPath}${normalizedPath === '/' ? '' : normalizedPath}`;
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

  return new URL(publicPath.replace(/^\//, ''), normalizedSiteUrl).toString();
};
