import fs from 'node:fs';
import path from 'node:path';

const sourceExtensions = ['.ts', '.tsx', '.mts', '.cts'];

export const resolveSourceModule = (importerPath, moduleSpecifier) => {
  if (!moduleSpecifier.startsWith('.')) {
    return undefined;
  }

  const unresolvedPath = path.resolve(
    path.dirname(importerPath),
    moduleSpecifier
  );
  const candidates = [
    unresolvedPath,
    ...sourceExtensions.map((extension) => `${unresolvedPath}${extension}`),
    ...sourceExtensions.map((extension) =>
      path.join(unresolvedPath, `index${extension}`)
    ),
  ];

  return candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  );
};
