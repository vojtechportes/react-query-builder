/* global process */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyVersionStage } from './utils/copy-version-stage.util.mjs';
import { createDeploymentUrl } from './utils/create-deployment-url.util.mjs';
import { createFtpHtaccess } from './utils/create-ftp-htaccess.util.mjs';
import { createNotFoundDocument } from './utils/create-not-found-document.util.mjs';
import { createRootRobots } from './utils/create-root-robots.util.mjs';
import { createSitemapIndex } from './utils/create-sitemap-index.util.mjs';
import { normalizeDeploymentBase } from './utils/normalize-deployment-base.util.mjs';
import { writeRedirectArtifacts } from './utils/write-redirect-artifacts.util.mjs';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(scriptRoot, '../..');
const stageRoot = path.join(exampleRoot, '.versioned-dist');
const distRoot = path.join(exampleRoot, 'dist');
const deploymentBase = normalizeDeploymentBase(process.env.VITE_BASE_PATH);
const configuredSiteUrl =
  process.env.VITE_SITE_URL ||
  'https://vojtechportes.github.io/react-query-builder/';
const siteUrl = new URL(configuredSiteUrl).toString();
const manifests = {};

if (
  path.dirname(distRoot) !== exampleRoot ||
  path.basename(distRoot) !== 'dist'
) {
  throw new Error(`Refusing to clean unexpected output path: ${distRoot}`);
}

for (const target of ['v1', 'v2']) {
  const targetStageRoot = path.join(stageRoot, target);
  const manifestPath = path.join(
    targetStageRoot,
    'route-redirect-manifest.json'
  );

  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `${target} staging output is missing its redirect manifest.`
    );
  }

  manifests[target] = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

for (const target of ['v1', 'v2']) {
  copyVersionStage(path.join(stageRoot, target), distRoot, target);
}

writeRedirectArtifacts(distRoot, deploymentBase, manifests);
fs.copyFileSync(
  path.join(exampleRoot, 'public', 'favicon.png'),
  path.join(distRoot, 'favicon.png')
);
fs.writeFileSync(path.join(distRoot, '.nojekyll'), '');
fs.writeFileSync(
  path.join(distRoot, '.htaccess'),
  createFtpHtaccess(manifests)
);
fs.writeFileSync(
  path.join(distRoot, 'robots.txt'),
  createRootRobots(siteUrl, deploymentBase)
);
fs.writeFileSync(
  path.join(distRoot, 'sitemap.xml'),
  createSitemapIndex(siteUrl)
);
fs.writeFileSync(
  path.join(distRoot, '404.html'),
  createNotFoundDocument(createDeploymentUrl(deploymentBase, '/v2'))
);
