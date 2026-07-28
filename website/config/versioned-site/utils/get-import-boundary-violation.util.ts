import { dirname, resolve } from 'node:path';
import { getSourceOwner } from './get-source-owner.util';
import { normalizeSourcePath } from './normalize-source-path.util';

export const getImportBoundaryViolation = (
  importer: string,
  source: string
): string | undefined => {
  const importerOwner = getSourceOwner(importer);

  if (!importerOwner) {
    return undefined;
  }

  if (
    importerOwner === 'shared' &&
    (source === '@vojtechportes/react-query-builder' ||
      source.startsWith('@vojtechportes/react-query-builder/') ||
      source === 'rqb-v1' ||
      source.startsWith('rqb-v1/') ||
      source === 'rqb-v2' ||
      source.startsWith('rqb-v2/'))
  ) {
    return 'shared modules cannot import a query-builder package binding';
  }

  if (
    importerOwner === 'v1' &&
    (source === 'rqb-v2' || source.startsWith('rqb-v2/'))
  ) {
    return 'v1 modules cannot import the v2 package binding';
  }

  if (
    importerOwner === 'v2' &&
    (source === 'rqb-v1' || source.startsWith('rqb-v1/'))
  ) {
    return 'v2 modules cannot import the v1 package binding';
  }

  if (!source.startsWith('.') && !source.startsWith('/')) {
    return undefined;
  }

  const importedPath = resolve(dirname(importer), source);
  const importedOwner = getSourceOwner(importedPath);
  const normalizedImporter = normalizeSourcePath(importer);
  const normalizedImportedPath = normalizeSourcePath(importedPath);
  const sourceRoot = normalizedImporter.slice(
    0,
    normalizedImporter.indexOf('/src/') + '/src/'.length
  );
  const importsWebsiteSource = normalizedImportedPath.startsWith(sourceRoot);

  if (
    (importerOwner === 'v1' && importedOwner === 'v2') ||
    (importerOwner === 'v2' && importedOwner === 'v1')
  ) {
    return `${importerOwner} modules cannot import ${importedOwner} modules`;
  }

  if (
    importerOwner === 'shared' &&
    importsWebsiteSource &&
    importedOwner !== 'shared'
  ) {
    return 'shared modules cannot import version-owned or legacy application modules';
  }

  return undefined;
};
