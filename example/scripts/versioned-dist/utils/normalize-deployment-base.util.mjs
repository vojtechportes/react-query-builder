export const normalizeDeploymentBase = (base = '') => {
  const normalized = `/${base}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');

  return normalized === '/' ? '' : normalized;
};
