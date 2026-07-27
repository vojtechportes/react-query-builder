import { createDeploymentUrl } from './create-deployment-url.util.mjs';

export const createRootRobots = (siteUrl, deploymentBase) => `User-agent: *
Allow: ${createDeploymentUrl(deploymentBase, '/v1/')}
Allow: ${createDeploymentUrl(deploymentBase, '/v2/')}

Sitemap: ${new URL('sitemap.xml', siteUrl).toString()}
`;
