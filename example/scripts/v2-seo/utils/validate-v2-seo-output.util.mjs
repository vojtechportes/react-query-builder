import fs from 'node:fs';
import path from 'node:path';
import { createV2CanonicalUrl } from './create-v2-canonical-url.util.mjs';
import { createV2Robots } from './create-v2-robots.util.mjs';
import { getV2RouteOutputPath } from './get-v2-route-output-path.util.mjs';

export const validateV2SeoOutput = ({
  distRoot,
  pages,
  seoConfig,
  siteUrl,
}) => {
  const errors = [];
  const sitemap = fs.readFileSync(path.join(distRoot, 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(distRoot, 'robots.txt'), 'utf8');

  if (robots !== createV2Robots(seoConfig, siteUrl)) {
    errors.push('v2 robots.txt does not match the owned indexing policy.');
  }

  for (const page of pages) {
    const outputPath = getV2RouteOutputPath(distRoot, page.path);

    if (!fs.existsSync(outputPath)) {
      errors.push(`Missing v2 static HTML for ${page.path}.`);
      continue;
    }

    const html = fs.readFileSync(outputPath, 'utf8');
    const canonicalUrl = createV2CanonicalUrl(
      page.path,
      siteUrl,
      seoConfig.versionPath
    );
    const title = `${page.title} | ${seoConfig.siteName}`;
    const h1Matches = html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi) ?? [];
    const structuredDataMatch =
      /<script\s+id="structured-data-page"\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i.exec(
        html
      );

    if (h1Matches.length !== 1) {
      errors.push(`${page.path} must contain exactly one h1.`);
    }
    if (!html.includes('data-styled="true"')) {
      errors.push(`${page.path} is missing styled-components SSR output.`);
    }
    if (!/<div id="root">[\s\S]+<\/div>/.test(html)) {
      errors.push(`${page.path} is missing non-empty SSR root output.`);
    }
    if (!html.includes('<script type="module"')) {
      errors.push(`${page.path} is missing the hydration module script.`);
    }
    if (!html.includes(`<title>${title}</title>`)) {
      errors.push(`${page.path} has incorrect title metadata.`);
    }
    if (!html.includes(`name="description" content="${page.description}`)) {
      errors.push(`${page.path} has incorrect description metadata.`);
    }
    if (
      !html.includes(`name="robots" content="${seoConfig.robotsDirective}"`)
    ) {
      errors.push(`${page.path} has incorrect robots metadata.`);
    }
    if (!html.includes(`rel="canonical" href="${canonicalUrl}"`)) {
      errors.push(`${page.path} has an incorrect v2 canonical URL.`);
    }
    if (!html.includes(`property="og:url" content="${canonicalUrl}"`)) {
      errors.push(`${page.path} has an incorrect Open Graph URL.`);
    }
    if (
      !html.includes(`property="og:title" content="${title}"`) ||
      !html.includes(`name="twitter:title" content="${title}"`) ||
      !html.includes(`name="twitter:description" content="${page.description}`)
    ) {
      errors.push(`${page.path} has incomplete social metadata.`);
    }
    if (html.includes('/v1/') || html.includes('data-seo-fallback')) {
      errors.push(`${page.path} contains v1 SEO output.`);
    }
    if (!structuredDataMatch) {
      errors.push(`${page.path} is missing structured data.`);
    } else {
      try {
        const structuredData = JSON.parse(structuredDataMatch[1]);
        const pageRecord = structuredData.find(
          (record) =>
            record['@type'] === 'WebPage' || record['@type'] === 'TechArticle'
        );
        const faqRecord = structuredData.find(
          (record) => record['@type'] === 'FAQPage'
        );
        const websiteRecord = structuredData.find(
          (record) => record['@type'] === 'WebSite'
        );
        const sourceRecord = structuredData.find(
          (record) => record['@type'] === 'SoftwareSourceCode'
        );

        if (
          !websiteRecord ||
          websiteRecord.version !== seoConfig.packageVersion ||
          websiteRecord.url !==
            createV2CanonicalUrl('/', siteUrl, seoConfig.versionPath)
        ) {
          errors.push(`${page.path} has incorrect v2 website structured data.`);
        }
        if (
          !sourceRecord ||
          sourceRecord.version !== seoConfig.packageVersion ||
          sourceRecord.url !== canonicalUrl
        ) {
          errors.push(`${page.path} has incorrect v2 source structured data.`);
        }
        if (
          !pageRecord ||
          pageRecord.url !== canonicalUrl ||
          pageRecord.version !== seoConfig.packageVersion
        ) {
          errors.push(`${page.path} has incorrect v2 page structured data.`);
        }
        if (Boolean(faqRecord) !== Boolean(page.faqs?.length)) {
          errors.push(`${page.path} has incorrect FAQ structured data.`);
        }
        if (JSON.stringify(structuredData).includes('/v1/')) {
          errors.push(`${page.path} structured data claims v1 content.`);
        }
      } catch {
        errors.push(`${page.path} contains invalid structured data JSON.`);
      }
    }

    const sitemapCount = sitemap.split(`<loc>${canonicalUrl}</loc>`).length - 1;

    if (sitemapCount !== 1) {
      errors.push(
        `${page.path} must appear exactly once in the v2 sitemap, found ${sitemapCount}.`
      );
    }
  }

  if (
    sitemap.includes('/v1/') ||
    sitemap.includes('<loc>' + siteUrl + '</loc>')
  ) {
    errors.push('v2 sitemap contains a route not owned by v2.');
  }

  return errors;
};
