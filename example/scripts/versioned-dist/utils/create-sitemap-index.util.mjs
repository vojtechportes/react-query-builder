export const createSitemapIndex = (siteUrl) => {
  const v1Sitemap = new URL('v1/sitemap.xml', siteUrl).toString();
  const v2Sitemap = new URL('v2/sitemap.xml', siteUrl).toString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${v1Sitemap}</loc></sitemap>
  <sitemap><loc>${v2Sitemap}</loc></sitemap>
</sitemapindex>
`;
};
