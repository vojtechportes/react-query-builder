export const normalizeSourcePath = (path: string): string =>
  path.replaceAll('\\', '/').split('?')[0];
