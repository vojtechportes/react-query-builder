import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import ts from 'typescript';
import type { ISourceImport } from '../types/source-import';

const sourceExtensions = new Set(['.ts', '.tsx', '.mts']);

export const collectSourceImports = (root: string): ISourceImport[] =>
  readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      return collectSourceImports(path);
    }

    if (!sourceExtensions.has(extname(entry.name))) {
      return [];
    }

    const source = readFileSync(path, 'utf8');
    const importSpecifiers = ts.preProcessFile(
      source,
      true,
      true
    ).importedFiles;

    return importSpecifiers.map(({ fileName }) => ({
      importer: path,
      source: fileName,
    }));
  });
