import type { VersionTarget } from '../types/version-target';

export const resolveVersionTarget = (mode: string): VersionTarget => {
  if (mode === 'v1' || mode === 'v2') {
    return mode;
  }

  throw new Error(
    `Expected a version target mode of "v1" or "v2", received "${mode}".`
  );
};
