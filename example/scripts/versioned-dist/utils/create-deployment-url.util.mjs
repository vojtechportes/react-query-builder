import { normalizeDeploymentBase } from './normalize-deployment-base.util.mjs';

export const createDeploymentUrl = (base, pathname) => {
  const normalizedBase = normalizeDeploymentBase(base);
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedBase}${normalizedPath}` || '/';
};
