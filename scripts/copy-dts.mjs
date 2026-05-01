/* global console */

import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const sourcePath = path.join(distDir, 'index.d.mts');
const targetPath = path.join(distDir, 'index.d.ts');

try {
  await access(sourcePath);
  await copyFile(sourcePath, targetPath);
} catch (error) {
  console.error('Unable to create dist/index.d.ts from dist/index.d.mts');
  throw error;
}
