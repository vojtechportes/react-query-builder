import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(exampleRoot, '..');
const seoConfig = JSON.parse(
  fs.readFileSync(path.join(exampleRoot, 'src', 'constants', 'seo-pages.json'), 'utf8')
);
const appSource = fs.readFileSync(path.join(exampleRoot, 'src', 'app', 'app.tsx'), 'utf8');
const sitemapSource = fs.readFileSync(path.join(exampleRoot, 'public', 'sitemap.xml'), 'utf8');

const errors = [];
const warn = message => errors.push(message);
const canonicalUrlForPath = pagePath => {
  const normalizedPath = pagePath === '/' ? '' : pagePath.replace(/^\//, '');
  return new URL(normalizedPath, seoConfig.siteUrl).toString();
};

const pages = seoConfig.pages;
const pagesByPath = new Map(pages.map(page => [page.path, page]));

if (pagesByPath.size !== pages.length) {
  warn('SEO registry contains duplicate page paths.');
}

for (const field of ['path', 'title', 'description', 'keywords', 'section']) {
  for (const page of pages) {
    if (!page[field] || typeof page[field] !== 'string') {
      warn(`${page.path || '<unknown>'} is missing ${field}.`);
    }
  }
}

for (const page of pages) {
  if (!page.path.startsWith('/')) {
    warn(`${page.path} must start with a slash.`);
  }

  if (page.title.length < 18 || page.title.length > 70) {
    warn(`${page.path} title should be between 18 and 70 characters.`);
  }

  if (page.description.length < 70 || page.description.length > 180) {
    warn(`${page.path} description should be between 70 and 180 characters.`);
  }

  const lowerKeywords = page.keywords.toLowerCase();
  for (const keyword of ['react query builder', 'typescript query builder']) {
    if (!lowerKeywords.includes(keyword)) {
      warn(`${page.path} keywords must include "${keyword}".`);
    }
  }
}

for (const [name, values] of [
  ['title', pages.map(page => page.title)],
  ['description', pages.map(page => page.description)],
]) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    warn(`SEO registry contains duplicate ${name} values: ${[...new Set(duplicates)].join(', ')}`);
  }
}

const routeRegex = /<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z]+Page)\s*\/>\}/g;
const appRoutes = new Set();
let routeMatch;
while ((routeMatch = routeRegex.exec(appSource))) {
  appRoutes.add(routeMatch[1]);
}

for (const route of appRoutes) {
  if (!pagesByPath.has(route)) {
    warn(`Route ${route} is missing from the SEO registry.`);
  }
}

for (const page of pages) {
  if (!appRoutes.has(page.path)) {
    warn(`SEO registry page ${page.path} is not backed by a direct public route.`);
  }
}

for (const page of pages) {
  const loc = `<loc>${canonicalUrlForPath(page.path)}</loc>`;
  const count = sitemapSource.split(loc).length - 1;
  if (count !== 1) {
    warn(`Public sitemap should contain ${loc} exactly once, found ${count}.`);
  }
}

const benchmarkPath = path.join(repoRoot, '.codex', 'seo-benchmark.md');
if (!fs.existsSync(benchmarkPath)) {
  warn('.codex/seo-benchmark.md is missing.');
}

if (errors.length > 0) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.length} canonical pages.`);
