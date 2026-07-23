import { resolve } from 'node:path';
import { canonicalPackageName } from '../constants/canonical-package-name';
import { packageExports } from '../constants/package-exports';

export const createPackageTypeScriptPaths = (
  packageRoot: string,
  localSourceRoot?: string
): Record<string, string[]> =>
  Object.fromEntries(
    packageExports.map(({ localSourcePath, publishedTypePath, subpath }) => [
      `${canonicalPackageName}${subpath}`,
      [
        resolve(
          localSourceRoot ?? packageRoot,
          localSourceRoot ? localSourcePath : publishedTypePath
        ),
      ],
    ])
  );
