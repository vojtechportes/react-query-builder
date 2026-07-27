import { createV1CanonicalUrl } from './create-v1-canonical-url.util.mjs';

export const createV1Robots = (seoConfig, siteUrl) =>
  `User-agent: *\nAllow: ${seoConfig.versionPath}\n\nSitemap: ${createV1CanonicalUrl(
    '/sitemap.xml',
    siteUrl,
    seoConfig.versionPath
  )}\n`;
