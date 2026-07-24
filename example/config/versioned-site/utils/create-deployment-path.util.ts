export const createDeploymentPath = (
  basename: string,
  path: string
): string => {
  const normalizedBasename = basename.replace(/\/$/, '');

  return `${normalizedBasename}${path}` || '/';
};
