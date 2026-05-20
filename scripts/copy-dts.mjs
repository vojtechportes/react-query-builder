/* global console */

import { copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

try {
  const files = await readdir(distDir);
  const declarationFiles = files.filter(fileName => fileName.endsWith('.d.mts'));

  await Promise.all(
    declarationFiles.map(fileName =>
      copyFile(
        path.join(distDir, fileName),
        path.join(distDir, fileName.replace(/\.d\.mts$/, '.d.ts'))
      )
    )
  );
} catch (error) {
  console.error('Unable to create .d.ts files from .d.mts build artifacts');
  throw error;
}
