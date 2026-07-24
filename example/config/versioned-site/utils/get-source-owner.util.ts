import type { SourceOwner } from '../types/source-owner';
import { normalizeSourcePath } from './normalize-source-path.util';

export const getSourceOwner = (path: string): SourceOwner | undefined => {
  const normalizedPath = normalizeSourcePath(path);

  if (normalizedPath.includes('/src/shared/')) {
    return 'shared';
  }

  if (normalizedPath.includes('/src/v1/')) {
    return 'v1';
  }

  if (normalizedPath.includes('/src/v2/')) {
    return 'v2';
  }

  return undefined;
};
