import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createV2PageHtml } from './utils/create-v2-page-html.util.mjs';
import { createV2Robots } from './utils/create-v2-robots.util.mjs';
import { createV2Sitemap } from './utils/create-v2-sitemap.util.mjs';
import { getV2RouteOutputPath } from './utils/get-v2-route-output-path.util.mjs';
import { validateV2SeoOutput } from './utils/validate-v2-seo-output.util.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(scriptDirectory, '../..');
const distRoot = path.join(exampleRoot, '.versioned-dist', 'v2');
const ssgRoot = path.join(distRoot, '.ssg');
const serverEntryUrl = pathToFileURL(
  path.join(ssgRoot, 'entry-server.mjs')
).href;
const { renderPage, v2RouteManifest } = await import(serverEntryUrl);
const seoConfig = JSON.parse(
  fs.readFileSync(
    path.join(
      exampleRoot,
      'src',
      'v2',
      'seo',
      'constants',
      'v2-seo-pages.json'
    ),
    'utf8'
  )
);
const configuredSiteUrl = process.env.VITE_SITE_URL || seoConfig.siteUrl;
let siteUrl;

try {
  siteUrl = new URL(configuredSiteUrl).toString();
} catch {
  throw new Error(
    `VITE_SITE_URL must be an absolute URL, received: ${configuredSiteUrl}`
  );
}

const pagesByPath = new Map(seoConfig.pages.map((page) => [page.path, page]));
const routesByPath = new Map(
  v2RouteManifest.map((route) => [route.path, route])
);

if (
  pagesByPath.size !== seoConfig.pages.length ||
  routesByPath.size !== v2RouteManifest.length ||
  pagesByPath.size !== routesByPath.size
) {
  throw new Error(
    'v2 SEO registry and route manifest have different route sets.'
  );
}

for (const page of seoConfig.pages) {
  const route = routesByPath.get(page.path);

  if (!route) {
    throw new Error(`v2 SEO route is not in the route manifest: ${page.path}`);
  }
  if (
    route.publicPath !==
    `${seoConfig.versionPath}${page.path === '/' ? '' : page.path}`
  ) {
    throw new Error(`v2 route has an incorrect public path: ${page.path}`);
  }
}

const indexPath = path.join(distRoot, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf8');

for (const route of v2RouteManifest) {
  const page = pagesByPath.get(route.path);
  const outputPath = getV2RouteOutputPath(distRoot, route.path);
  const html = createV2PageHtml({
    baseHtml,
    page,
    route,
    renderedPage: renderPage(route.path),
    seoConfig,
    siteUrl,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
}

fs.writeFileSync(
  path.join(distRoot, 'sitemap.xml'),
  createV2Sitemap(v2RouteManifest, seoConfig, siteUrl)
);
fs.writeFileSync(
  path.join(distRoot, 'robots.txt'),
  createV2Robots(seoConfig, siteUrl)
);

const errors = validateV2SeoOutput({
  distRoot,
  pages: seoConfig.pages,
  seoConfig,
  siteUrl,
});

if (errors.length > 0) {
  throw new Error(`v2 SEO build validation failed:\n- ${errors.join('\n- ')}`);
}

fs.rmSync(ssgRoot, { recursive: true, force: true });
