import { escapeHtml } from './escape-html.util.mjs';
import { createV2CanonicalUrl } from './create-v2-canonical-url.util.mjs';

export const createV2Sitemap = (
  routes,
  seoConfig,
  siteUrl
) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url>\n    <loc>${escapeHtml(
        createV2CanonicalUrl(route.publicPath, siteUrl, seoConfig.versionPath)
      )}</loc>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
