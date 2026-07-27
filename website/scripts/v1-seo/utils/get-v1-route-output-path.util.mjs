import path from 'node:path';

export const getV1RouteOutputPath = (distRoot, routePath) =>
  routePath === '/'
    ? path.join(distRoot, 'index.html')
    : path.join(distRoot, routePath.replace(/^\//, ''), 'index.html');
