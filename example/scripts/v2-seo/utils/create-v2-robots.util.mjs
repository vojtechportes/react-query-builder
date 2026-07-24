import { createV2CanonicalUrl } from './create-v2-canonical-url.util.mjs';

export const createV2Robots = (seoConfig, siteUrl) =>
  `User-agent: *\nAllow: ${seoConfig.versionPath}\n\nSitemap: ${createV2CanonicalUrl(
    '/sitemap.xml',
    siteUrl,
    seoConfig.versionPath
  )}\n`;
