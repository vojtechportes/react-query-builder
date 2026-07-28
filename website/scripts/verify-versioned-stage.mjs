import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];

if (target !== 'v1' && target !== 'v2') {
  throw new Error(
    `Expected a version target of "v1" or "v2", received "${target}".`
  );
}

const scriptsRoot = path.dirname(fileURLToPath(import.meta.url));
const stageRoot = path.resolve(scriptsRoot, '..', '.versioned-dist', target);
const requiredPaths = [
  'index.html',
  'package-module-graph.json',
  'route-redirect-manifest.json',
  'robots.txt',
  'sitemap.xml',
];

for (const requiredPath of requiredPaths) {
  if (!fs.existsSync(path.join(stageRoot, requiredPath))) {
    throw new Error(`${target} staging output is missing ${requiredPath}.`);
  }
}

const moduleGraph = JSON.parse(
  fs.readFileSync(path.join(stageRoot, 'package-module-graph.json'), 'utf8')
);

if (moduleGraph.target !== target) {
  throw new Error(
    `${target} staging contains the ${moduleGraph.target} package module graph.`
  );
}

if (
  moduleGraph.packageModules.length === 0 ||
  moduleGraph.oppositeModules.length > 0
) {
  throw new Error(`${target} staging failed package module isolation.`);
}

const indexHtml = fs.readFileSync(path.join(stageRoot, 'index.html'), 'utf8');

if (!indexHtml.includes('<div id="root">') || !indexHtml.includes('<h1')) {
  throw new Error(
    `${target} staging is missing the server-rendered hydration surface.`
  );
}
const stylesheetMarker = '--query-builder-color-primary-default:';
const stagedFiles = fs
  .readdirSync(stageRoot, { recursive: true })
  .map((file) => file.replaceAll('\\', '/'));
const stylesheetFiles = stagedFiles.filter((file) => file.endsWith('.css'));
const stylesheetMarkerCount = stylesheetFiles.reduce((count, file) => {
  const stylesheet = fs.readFileSync(path.join(stageRoot, file), 'utf8');

  return count + stylesheet.split(stylesheetMarker).length - 1;
}, 0);
const expectedMarkerCount = target === 'v2' ? 1 : 0;

if (stylesheetMarkerCount !== expectedMarkerCount) {
  throw new Error(
    `${target} staging contains ${stylesheetMarkerCount} React Query Builder stylesheet copies; expected ${expectedMarkerCount}.`
  );
}

const htmlFiles = stagedFiles.filter((file) => file.endsWith('.html'));
const containsPrismMarkup = htmlFiles.some((htmlFile) => {
  const html = fs.readFileSync(path.join(stageRoot, htmlFile), 'utf8');

  return html.includes('prism-code') && html.includes('token keyword');
});

if (!containsPrismMarkup) {
  throw new Error(
    `${target} staging is missing server-rendered Prism syntax highlighting.`
  );
}

const containsMuiScopedBaseline = stagedFiles
  .filter(
    (file) =>
      file.startsWith('assets/mui-builder-surface-') && file.endsWith('.js')
  )
  .some((file) =>
    fs
      .readFileSync(path.join(stageRoot, file), 'utf8')
      .includes('MuiScopedCssBaseline')
  );

if (!containsMuiScopedBaseline) {
  throw new Error(
    `${target} staging is missing the production Material UI scoped baseline.`
  );
}

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(path.join(stageRoot, htmlFile), 'utf8');

  if (!html.includes('<div id="root">')) {
    continue;
  }

  const stylesheetUrls = [
    ...html.matchAll(/<link[^>]+href="([^"]+)"[^>]+rel="stylesheet"/g),
    ...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g),
  ].map((match) => match[1]);
  const packageStylesheetUrls = stylesheetUrls.filter((stylesheetUrl) => {
    const pathname = new URL(stylesheetUrl, 'https://example.test').pathname;
    const versionPathIndex = pathname.lastIndexOf(`/${target}/`);

    if (versionPathIndex < 0) {
      return false;
    }

    const stylesheetPath = decodeURIComponent(
      pathname.slice(versionPathIndex + target.length + 2)
    );

    if (!stylesheetFiles.includes(stylesheetPath)) {
      throw new Error(
        `${target} staging references a missing stylesheet from ${htmlFile}: ${stylesheetUrl}.`
      );
    }

    return fs
      .readFileSync(path.join(stageRoot, stylesheetPath), 'utf8')
      .includes(stylesheetMarker);
  });
  const expectedPackageStylesheetUrls = target === 'v2' ? 1 : 0;

  if (packageStylesheetUrls.length !== expectedPackageStylesheetUrls) {
    throw new Error(
      `${target} staging page ${htmlFile} references ${packageStylesheetUrls.length} React Query Builder stylesheets; expected ${expectedPackageStylesheetUrls}.`
    );
  }
}

if (!indexHtml.includes('data-styled=')) {
  throw new Error(`${target} staging is missing server-rendered site styles.`);
}
