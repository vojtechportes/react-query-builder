/* global process */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDeploymentUrl } from './utils/create-deployment-url.util.mjs';
import { getRedirectOutputPath } from './utils/get-redirect-output-path.util.mjs';
import { normalizeDeploymentBase } from './utils/normalize-deployment-base.util.mjs';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(scriptRoot, '../..');
const stageRoot = path.join(exampleRoot, '.versioned-dist');
const distRoot = path.join(exampleRoot, 'dist');
const deploymentBase = normalizeDeploymentBase(process.env.VITE_BASE_PATH);
const manifests = {};
const errors = [];

for (const target of ['v1', 'v2']) {
  manifests[target] = JSON.parse(
    fs.readFileSync(
      path.join(stageRoot, target, 'route-redirect-manifest.json'),
      'utf8'
    )
  );
}

for (const requiredPath of [
  '.htaccess',
  '.nojekyll',
  '404.html',
  'favicon.png',
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'v1/index.html',
  'v1/robots.txt',
  'v1/sitemap.xml',
  'v2/index.html',
  'v2/robots.txt',
  'v2/sitemap.xml',
]) {
  if (!fs.existsSync(path.join(distRoot, requiredPath))) {
    errors.push(`Missing assembled path: ${requiredPath}`);
  }
}

for (const target of ['v1', 'v2']) {
  const targetRoot = path.join(distRoot, target);

  if (
    fs.existsSync(path.join(targetRoot, 'package-module-graph.json')) ||
    fs.existsSync(path.join(targetRoot, 'route-redirect-manifest.json')) ||
    fs.existsSync(path.join(targetRoot, '.ssg'))
  ) {
    errors.push(`${target} exposes staging-only files.`);
  }

  for (const pathname of manifests[target].canonicalPaths) {
    const relativePath = pathname === '/' ? '' : pathname.replace(/^\//, '');
    const htmlPath = path.join(targetRoot, relativePath, 'index.html');

    if (!fs.existsSync(htmlPath)) {
      errors.push(`${target} is missing canonical HTML for ${pathname}.`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    if (!html.includes('<h1') || !html.includes('rel="canonical"')) {
      errors.push(`${target}${pathname} is missing crawlable SEO markup.`);
    }

    const assetUrls = [
      ...html.matchAll(/<script[^>]+src="([^"]+)"/g),
      ...html.matchAll(/<link[^>]+href="([^"]+)"[^>]+rel="stylesheet"/g),
      ...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g),
    ].map((match) => match[1]);
    const expectedPrefix = createDeploymentUrl(deploymentBase, `/${target}/`);

    for (const assetUrl of assetUrls) {
      if (!assetUrl.startsWith(expectedPrefix)) {
        errors.push(`${target}${pathname} loads an unowned asset: ${assetUrl}`);
        continue;
      }

      const artifactPath = assetUrl
        .split(/[?#]/, 1)[0]
        .slice(deploymentBase.length)
        .replace(/^\//, '');

      if (!fs.existsSync(path.join(distRoot, artifactPath))) {
        errors.push(
          `${target}${pathname} references missing asset: ${assetUrl}`
        );
      }
    }
  }
}

const redirects = new Map();

for (const pathname of manifests.v2.canonicalPaths) {
  redirects.set(
    pathname,
    createDeploymentUrl(
      deploymentBase,
      pathname === '/' ? '/v2' : `/v2${pathname}`
    )
  );
}
for (const redirect of manifests.v2.redirects) {
  redirects.set(
    redirect.from,
    createDeploymentUrl(deploymentBase, `/v2${redirect.to}`)
  );
}
for (const target of ['v1', 'v2']) {
  for (const redirect of manifests[target].redirects) {
    redirects.set(
      `/${target}${redirect.from}`,
      createDeploymentUrl(deploymentBase, `/${target}${redirect.to}`)
    );
  }
}

for (const [source, destination] of redirects) {
  const documentPath = getRedirectOutputPath(distRoot, source);
  const document = fs.existsSync(documentPath)
    ? fs.readFileSync(documentPath, 'utf8')
    : '';

  if (
    !document.includes('name="robots" content="noindex"') ||
    !document.includes(JSON.stringify(destination))
  ) {
    errors.push(`Incorrect redirect document for ${source} to ${destination}.`);
  }
}

const rootRobots = fs.readFileSync(path.join(distRoot, 'robots.txt'), 'utf8');

for (const target of ['v1', 'v2']) {
  const allowedPath = createDeploymentUrl(deploymentBase, `/${target}/`);

  if (!rootRobots.includes(`Allow: ${allowedPath}`)) {
    errors.push(`Root robots policy is missing ${allowedPath}.`);
  }
}
const htaccess = fs.readFileSync(path.join(distRoot, '.htaccess'), 'utf8');
const trackedHtaccess = fs.readFileSync(
  path.resolve(exampleRoot, '..', '.github', 'deploy', 'ftp', '.htaccess'),
  'utf8'
);

if (htaccess !== trackedHtaccess) {
  errors.push(
    'Generated FTP configuration differs from the tracked deployment file.'
  );
}

if (!htaccess.includes('[R=308,L,NE]')) {
  errors.push('FTP configuration does not contain permanent redirect rules.');
}

if (errors.length > 0) {
  throw new Error(
    `Versioned artifact verification failed:\n- ${errors.join('\n- ')}`
  );
}

console.log(
  `Verified assembled v1/v2 artifact for base ${deploymentBase || '/'} with ${redirects.size} redirects.`
);
