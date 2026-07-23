/* global console, process, URL */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(exampleRoot, '..');
const seoConfig = JSON.parse(
  fs.readFileSync(
    path.join(exampleRoot, 'src', 'constants', 'seo-pages.json'),
    'utf8'
  )
);
const appSource = fs.readFileSync(
  path.join(exampleRoot, 'src', 'app', 'app-routes.tsx'),
  'utf8'
);
const searchSource = fs.readFileSync(
  path.join(exampleRoot, 'src', 'hooks', 'use-site-search.ts'),
  'utf8'
);
const sitemapSource = fs.readFileSync(
  path.join(exampleRoot, 'public', 'sitemap.xml'),
  'utf8'
);
const ftpHtaccessPath = path.join(
  repoRoot,
  '.github',
  'deploy',
  'ftp',
  '.htaccess'
);
const ftpWorkflowSource = fs.readFileSync(
  path.join(repoRoot, '.github', 'workflows', 'deploy-example-ftp.yml'),
  'utf8'
);
const recipesDir = path.join(
  exampleRoot,
  'src',
  'pages',
  'recipes-page',
  'pages'
);
const recipeSources = fs
  .readdirSync(recipesDir)
  .filter((file) => file.endsWith('.recipe.ts'))
  .map((file) => ({
    file,
    source: fs.readFileSync(path.join(recipesDir, file), 'utf8'),
  }));

const errors = [];
const warn = (message) => errors.push(message);
const canonicalUrlForPath = (pagePath) => {
  const normalizedPath = pagePath === '/' ? '' : pagePath.replace(/^\//, '');
  return new URL(normalizedPath, seoConfig.siteUrl).toString();
};

const pages = seoConfig.pages;

if (!fs.existsSync(ftpHtaccessPath)) {
  warn('FTP deployment .htaccess is missing.');
} else {
  const ftpHtaccessSource = fs.readFileSync(ftpHtaccessPath, 'utf8');
  for (const directive of [
    'Options -Indexes',
    'DirectorySlash Off',
    'RewriteEngine On',
    'https://www.react-query-builder.com/$1',
    '$1/index.html',
  ]) {
    if (!ftpHtaccessSource.includes(directive)) {
      warn(`FTP deployment .htaccess is missing: ${directive}`);
    }
  }
}

if (fs.existsSync(path.join(exampleRoot, 'public', '.htaccess'))) {
  warn('FTP .htaccess must not be present in example/public.');
}

if (
  !ftpWorkflowSource.includes(
    'cp .github/deploy/ftp/.htaccess example/dist/.htaccess'
  )
) {
  warn(
    'FTP workflow must copy the hosting configuration after the example build.'
  );
}
const pagesByPath = new Map(pages.map((page) => [page.path, page]));

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
  ['title', pages.map((page) => page.title)],
  ['description', pages.map((page) => page.description)],
]) {
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index
  );
  if (duplicates.length > 0) {
    warn(
      `SEO registry contains duplicate ${name} values: ${[...new Set(duplicates)].join(', ')}`
    );
  }
}

if (!appSource.includes('canonicalSeoPages.map')) {
  warn('Shared routes must be generated from the canonical SEO page registry.');
}
const appRoutes = new Set(pages.map((page) => page.path));

for (const route of appRoutes) {
  if (!pagesByPath.has(route)) {
    warn(`Route ${route} is missing from the SEO registry.`);
  }
}

for (const page of pages) {
  if (!appRoutes.has(page.path)) {
    warn(
      `SEO registry page ${page.path} is not backed by a direct public route.`
    );
  }
}

for (const page of pages) {
  const loc = `<loc>${canonicalUrlForPath(page.path)}</loc>`;
  const count = sitemapSource.split(loc).length - 1;
  if (count !== 1) {
    warn(`Public sitemap should contain ${loc} exactly once, found ${count}.`);
  }
}

const searchDocumentsSource = searchSource.slice(
  searchSource.indexOf('const searchDocuments'),
  searchSource.indexOf('export const useSiteSearch')
);
if (!searchDocumentsSource.includes('...recipes.map')) {
  warn(
    'Recipe pages must be added to the MiniSearch searchDocuments collection.'
  );
}
const referencedSnippetFiles = new Set();
const referencedDemoFiles = new Set();
const recipePaths = new Set();
const recipeRecords = [];
for (const { file, source } of recipeSources) {
  const readString = (field) =>
    new RegExp(`${field}:\\s*'([^']*)'`).exec(source)?.[1];
  const record = {
    file,
    path: readString('path'),
    title: readString('title'),
    description: readString('description'),
    primaryKeyword: readString('primaryKeyword'),
    searchText: readString('searchText'),
    source,
  };
  recipeRecords.push(record);
  if (record.path) recipePaths.add(record.path);
  for (const field of [
    'path',
    'title',
    'description',
    'primaryKeyword',
    'searchText',
  ]) {
    if (!record[field]) warn(`${file} is missing recipe field ${field}.`);
  }
  for (const field of [
    'secondaryKeywords',
    'relatedRecipePaths',
    'relatedDocPaths',
    'faqs',
  ]) {
    if (!new RegExp(`${field}: \\[`).test(source))
      warn(`${file} is missing recipe field ${field}.`);
  }
  if (
    !source.includes('fieldsCode:') ||
    !source.includes('builderCode:') ||
    !source.includes('transformCode:')
  ) {
    warn(`${file} is missing a complete copy-ready recipe code section.`);
  }
  const demoMatch =
    /demoLoader:\s*\(\)\s*=>\s*import\('\.\.\/demos\/([^']+)'\)/.exec(source);
  if (!demoMatch) {
    warn(`${file} is missing a lazy interactive demo loader.`);
  } else {
    const demoFile = `${demoMatch[1]}.tsx`;
    if (referencedDemoFiles.has(demoFile)) {
      warn(`${demoFile} is referenced by more than one recipe.`);
    }
    referencedDemoFiles.add(demoFile);
  }
}

if (recipeRecords.length !== 13) {
  warn(
    `Expected 13 published recipe definitions, found ${recipeRecords.length}.`
  );
}

for (const recipe of recipeRecords) {
  const seoPage = pagesByPath.get(recipe.path);
  if (!seoPage) {
    warn(`${recipe.file} is missing from the SEO registry.`);
    continue;
  }
  for (const field of [
    'title',
    'description',
    'primaryKeyword',
    'searchText',
  ]) {
    if (seoPage[field] !== recipe[field])
      warn(`${recipe.path} SEO ${field} does not match its recipe registry.`);
  }
  if (!seoPage.faqs?.length)
    warn(`${recipe.path} must expose FAQ metadata for structured data.`);
  for (const field of [
    'summary',
    'capabilities',
    'safetyNotes',
    'productionNotes',
  ]) {
    if (!seoPage[field]?.length)
      warn(`${recipe.path} is missing crawlable recipe field ${field}.`);
  }
  if (!recipe.source.includes('illustrative: true')) {
    const snippetMatch =
      /import snippetSource from '\.\.\/snippets\/([^']+)\?raw';/.exec(
        recipe.source
      );
    if (
      !snippetMatch ||
      !recipe.source.includes('builderCode: snippetSource')
    ) {
      warn(`${recipe.path} must display a compiled raw snippet.`);
    } else {
      referencedSnippetFiles.add(snippetMatch[1]);
    }
  }
  const relatedMatch = /relatedRecipePaths: \[([^\]]*)\]/.exec(recipe.source);
  const relatedPaths = [
    ...(relatedMatch?.[1].matchAll(/'([^']+)'/g) ?? []),
  ].map((match) => match[1]);
  for (const relatedPath of relatedPaths) {
    if (!recipePaths.has(relatedPath))
      warn(`${recipe.path} links to unpublished recipe ${relatedPath}.`);
  }
}

const snippetsDir = path.join(
  exampleRoot,
  'src',
  'pages',
  'recipes-page',
  'snippets'
);
const snippetFiles = fs
  .readdirSync(snippetsDir)
  .filter((file) => file.endsWith('.snippet.tsx'));
for (const snippetFile of snippetFiles) {
  if (!referencedSnippetFiles.has(snippetFile))
    warn(`${snippetFile} is compiled but not displayed by a recipe.`);
}
for (const snippetFile of referencedSnippetFiles) {
  if (!snippetFiles.includes(snippetFile))
    warn(`${snippetFile} is referenced by a recipe but is missing.`);
}
const demosDir = path.join(
  exampleRoot,
  'src',
  'pages',
  'recipes-page',
  'demos'
);
const demoFiles = fs
  .readdirSync(demosDir)
  .filter((file) => file.endsWith('.demo.tsx'));
for (const demoFile of demoFiles) {
  if (!referencedDemoFiles.has(demoFile))
    warn(`${demoFile} exists but is not referenced by a recipe.`);
}
for (const demoFile of referencedDemoFiles) {
  if (!demoFiles.includes(demoFile))
    warn(`${demoFile} is referenced by a recipe but is missing.`);
}
if (referencedDemoFiles.size !== recipeRecords.length) {
  warn(
    `Expected one unique interactive demo per recipe; found ${referencedDemoFiles.size} demos for ${recipeRecords.length} recipes.`
  );
}
const examplePackage = JSON.parse(
  fs.readFileSync(path.join(exampleRoot, 'package.json'), 'utf8')
);
if (
  !examplePackage.scripts['recipes:validate']?.includes('tsc') ||
  !examplePackage.scripts.build?.includes('recipes:validate')
) {
  warn('The example build must type-check published recipe snippets.');
}
const recipeRoutes = [...appRoutes].filter(
  (route) => route.startsWith('/recipes/') && route !== '/recipes'
);
for (const recipePath of recipePaths) {
  if (!appRoutes.has(recipePath))
    warn(`${recipePath} is missing a direct recipe route.`);
}
for (const recipeRoute of recipeRoutes) {
  if (!recipePaths.has(recipeRoute))
    warn(`${recipeRoute} has no published recipe definition.`);
}
if (recipeRoutes.length !== recipeRecords.length) {
  warn(
    `Expected one direct route per recipe; found ${recipeRoutes.length} routes for ${recipeRecords.length} recipes.`
  );
}
const distRoot = path.join(exampleRoot, 'dist');
if (fs.existsSync(distRoot)) {
  for (const page of pages) {
    const outputPath =
      page.path === '/'
        ? path.join(distRoot, 'index.html')
        : path.join(distRoot, page.path.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(outputPath)) {
      warn(`${page.path} is missing generated route HTML.`);
      continue;
    }

    const html = fs.readFileSync(outputPath, 'utf8');
    const h1Matches = html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi) ?? [];
    if (
      h1Matches.length !== 1 ||
      !html.includes('data-styled="true"') ||
      !html.includes('<script id="structured-data-page"') ||
      !html.includes('<script type="module"') ||
      !html.includes('data-client-only-placeholder="true"') ||
      html.includes('data-seo-fallback')
    ) {
      warn(
        `${page.path} generated HTML is missing complete pre-rendered content.`
      );
    }

    if (
      page.section === 'Recipes' &&
      page.faqs?.length &&
      !html.includes('Frequently asked questions</h2>')
    ) {
      warn(`${page.path} generated HTML is missing crawlable FAQ content.`);
    }
  }
}
const benchmarkPath = path.join(repoRoot, '.codex', 'seo-benchmark.md');
if (!fs.existsSync(benchmarkPath)) {
  warn('.codex/seo-benchmark.md is missing.');
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.length} canonical pages.`);
