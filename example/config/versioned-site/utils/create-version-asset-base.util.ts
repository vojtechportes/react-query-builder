import type { VersionTarget } from '../types/version-target';

export const createVersionAssetBase = (
  deploymentBase: string | undefined,
  target: VersionTarget
): string => {
  const normalizedBase = `/${deploymentBase ?? ''}`.replace(/\/+/g, '/');
  const baseWithTrailingSlash = normalizedBase.endsWith('/')
    ? normalizedBase
    : `${normalizedBase}/`;

  return `${baseWithTrailingSlash}${target}/`;
};
