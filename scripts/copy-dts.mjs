/* global console */

import { copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

const findDeclarationFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const resolvedPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findDeclarationFiles(resolvedPath);
      }

      return entry.name.endsWith('.d.mts') ? [resolvedPath] : [];
    })
  );

  return nestedFiles.flat();
};

try {
  const declarationFiles = await findDeclarationFiles(distDir);

  await Promise.all(
    declarationFiles.map(fileName =>
      copyFile(
        fileName,
        fileName.replace(/\.d\.mts$/, '.d.ts')
      )
    )
  );
} catch (error) {
  console.error('Unable to create .d.ts files from .d.mts build artifacts');
  throw error;
}
