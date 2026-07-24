import fs from 'node:fs';
import path from 'node:path';
import { createDeploymentUrl } from './create-deployment-url.util.mjs';
import { createRedirectDocument } from './create-redirect-document.util.mjs';
import { getRedirectOutputPath } from './get-redirect-output-path.util.mjs';

export const writeRedirectArtifacts = (distRoot, deploymentBase, manifests) => {
  const writes = new Map();

  for (const pathname of manifests.v2.canonicalPaths) {
    const destination = createDeploymentUrl(
      deploymentBase,
      pathname === '/' ? '/v2' : `/v2${pathname}`
    );

    writes.set(pathname, destination);
  }

  for (const redirect of manifests.v2.redirects) {
    writes.set(
      redirect.from,
      createDeploymentUrl(deploymentBase, `/v2${redirect.to}`)
    );
  }

  for (const target of ['v1', 'v2']) {
    for (const redirect of manifests[target].redirects) {
      writes.set(
        `/${target}${redirect.from}`,
        createDeploymentUrl(deploymentBase, `/${target}${redirect.to}`)
      );
    }
  }

  for (const [source, destination] of writes) {
    const outputPath = getRedirectOutputPath(distRoot, source);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, createRedirectDocument(destination));
  }
};
