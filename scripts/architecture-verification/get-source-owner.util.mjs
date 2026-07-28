import path from 'node:path';

export const getSourceOwner = (sourcePath) => {
  const normalizedPath = sourcePath.split(path.sep).join('/');
  const segments = normalizedPath.split('/');

  if (normalizedPath === 'index.tsx') {
    return 'root';
  }

  if (segments[0] === 'builder' || segments[0] === 'shared') {
    return segments[0];
  }

  if (segments[0] !== 'subpackages') {
    return 'unknown';
  }

  if (segments[1] === 'adapters') {
    return `adapter:${segments[2] ?? 'unknown'}`;
  }

  return `subpackage:${segments[1] ?? 'unknown'}`;
};
