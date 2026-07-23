import type { VersionTarget } from '../types/version-target';

export const getTargetPackageBoundaryViolation = (
  target: VersionTarget,
  source: string
): string | undefined => {
  const oppositePackage = target === 'v1' ? 'rqb-v2' : 'rqb-v1';

  if (source === oppositePackage || source.startsWith(`${oppositePackage}/`)) {
    return `${target} modules cannot import the ${oppositePackage} package binding`;
  }

  return undefined;
};
