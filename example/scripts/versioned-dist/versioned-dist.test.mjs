import assert from 'node:assert/strict';
import path from 'node:path';
import { createDeploymentUrl } from './utils/create-deployment-url.util.mjs';
import { createFtpHtaccess } from './utils/create-ftp-htaccess.util.mjs';
import { createRedirectDocument } from './utils/create-redirect-document.util.mjs';
import { createRootRobots } from './utils/create-root-robots.util.mjs';
import { getRedirectOutputPath } from './utils/get-redirect-output-path.util.mjs';
import { normalizeDeploymentBase } from './utils/normalize-deployment-base.util.mjs';

const manifests = {
  v1: {
    canonicalPaths: ['/', '/api/builder'],
    redirects: [{ from: '/api/builder-props', to: '/api/builder' }],
  },
  v2: {
    canonicalPaths: ['/', '/api/builder'],
    redirects: [{ from: '/api/builder-props', to: '/api/builder' }],
  },
};

assert.equal(normalizeDeploymentBase(), '');
assert.equal(normalizeDeploymentBase('/'), '');
assert.equal(
  normalizeDeploymentBase('react-query-builder/'),
  '/react-query-builder'
);
assert.equal(
  createDeploymentUrl('/react-query-builder/', '/v2/api'),
  '/react-query-builder/v2/api'
);

const document = createRedirectDocument('/v2/api/builder?unsafe=<value>');

assert.match(document, /name="robots" content="noindex"/);
assert.match(document, /window\.location\.search \+ window\.location\.hash/);
assert.match(document, /&lt;value&gt;/);
assert.match(document, /\\u003cvalue>/);

const htaccess = createFtpHtaccess(manifests);

assert.match(htaccess, /RewriteRule \^\$ \/v2 \[R=308,L,NE\]/);
assert.match(
  htaccess,
  /RewriteRule \^api\/builder-props\/\?\$ \/v2\/api\/builder/
);
assert.match(
  htaccess,
  /RewriteRule \^v1\/api\/builder-props\/\?\$ \/v1\/api\/builder/
);
assert.equal(
  getRedirectOutputPath('C:/artifact', '/v2/api/builder-props'),
  'C:/artifact/v2/api/builder-props/index.html'
);
assert.equal(
  path.normalize(getRedirectOutputPath('C:/artifact', '/')),
  path.normalize('C:/artifact/index.html')
);

const repositoryRobots = createRootRobots(
  'https://example.com/react-query-builder/',
  '/react-query-builder/'
);

assert.match(repositoryRobots, /Allow: \/react-query-builder\/v1\//);
assert.match(repositoryRobots, /Allow: \/react-query-builder\/v2\//);
assert.match(createRootRobots('https://example.com/', ''), /Allow: \/v1\//);

console.log('Versioned deployment utility tests passed.');
