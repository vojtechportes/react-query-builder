import { resolve } from 'node:path';
import type { IPackageAlias } from '../types/package-alias';
import { canonicalPackageName } from '../constants/canonical-package-name';
import { packageExports } from '../constants/package-exports';

export const createPackageAliases = (
  packageRoot: string,
  localSourceRoot?: string
): IPackageAlias[] =>
  packageExports.map(({ localSourcePath, publishedImportPath, subpath }) => ({
    find: `${canonicalPackageName}${subpath}`,
    replacement: resolve(
      localSourceRoot ?? packageRoot,
      localSourceRoot ? localSourcePath : publishedImportPath
    ),
  }));
