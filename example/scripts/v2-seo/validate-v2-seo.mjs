import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getV2SeoOwnershipErrors } from './utils/get-v2-seo-ownership-errors.util.mjs';
import { validateV2SeoOutput } from './utils/validate-v2-seo-output.util.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(scriptDirectory, '../..');
const distRoot = path.join(exampleRoot, '.versioned-dist', 'v2');
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

const errors = [
  ...validateV2SeoOutput({
    distRoot,
    pages: seoConfig.pages,
    seoConfig,
    siteUrl,
  }),
  ...getV2SeoOwnershipErrors([
    path.join(exampleRoot, 'src', 'v2', 'seo'),
    path.join(exampleRoot, 'src', 'v2', 'pages'),
    path.join(exampleRoot, 'scripts', 'v2-seo'),
  ]),
];

if (errors.length > 0) {
  console.error('v2 SEO validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `v2 SEO validation passed for ${seoConfig.pages.length} canonical routes.`
  );
}
