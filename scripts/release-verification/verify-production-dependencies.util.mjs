import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveProductionDependencyPairs } from './resolve-production-dependency-pairs.util.mjs';

const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
const packageLock = JSON.parse(
  await readFile(path.join(rootDirectory, 'package-lock.json'), 'utf8')
);
const productionDependencyPairs = resolveProductionDependencyPairs(
  packageLock.packages
);

console.log(
  `Production dependency tree verified across ${productionDependencyPairs.size} packages.`
);
