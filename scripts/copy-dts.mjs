/* global console */

import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, '..', 'dist');
const packageJsonPath = path.join(rootDir, 'package.json');

const getPublicDeclarationFiles = async () => {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const declarationFiles = new Set();

  if (typeof packageJson.types === 'string') {
    declarationFiles.add(path.resolve(rootDir, packageJson.types));
  }

  for (const exportDefinition of Object.values(packageJson.exports ?? {})) {
    if (
      exportDefinition &&
      typeof exportDefinition === 'object' &&
      typeof exportDefinition.types === 'string'
    ) {
      declarationFiles.add(path.resolve(rootDir, exportDefinition.types));
    }
  }

  return [...declarationFiles].filter(fileName =>
    fileName.startsWith(distDir) && fileName.endsWith('.d.ts')
  );
};

try {
  const declarationFiles = await getPublicDeclarationFiles();

  await Promise.all(
    declarationFiles.map(fileName =>
      copyFile(
        fileName.replace(/\.d\.ts$/, '.d.mts'),
        fileName
      )
    )
  );
} catch (error) {
  console.error('Unable to create public .d.ts files from .d.mts build artifacts');
  throw error;
}
