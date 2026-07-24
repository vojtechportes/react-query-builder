/* global console, process, URL */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getV1SeoOwnershipErrors } from './utils/get-v1-seo-ownership-errors.util.mjs';
import { validateV1SeoOutput } from './utils/validate-v1-seo-output.util.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(scriptDirectory, '../..');
const distRoot = path.join(exampleRoot, '.versioned-dist', 'v1');
const seoConfig = JSON.parse(
  fs.readFileSync(
    path.join(
      exampleRoot,
      'src',
      'v1',
      'seo',
      'constants',
      'v1-seo-pages.json'
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

const errors = [
  ...validateV1SeoOutput({
    distRoot,
    pages: seoConfig.pages,
    seoConfig,
    siteUrl,
  }),
  ...getV1SeoOwnershipErrors([
    path.join(exampleRoot, 'src', 'v1', 'seo'),
    path.join(exampleRoot, 'src', 'v1', 'pages'),
    path.join(exampleRoot, 'scripts', 'v1-seo'),
  ]),
];

if (errors.length > 0) {
  console.error('v1 SEO validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `v1 SEO validation passed for ${seoConfig.pages.length} canonical routes.`
  );
}
