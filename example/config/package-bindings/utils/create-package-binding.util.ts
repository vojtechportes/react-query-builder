import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalPackageName } from '../constants/canonical-package-name';
import type { IPackageBinding } from '../types/package-binding';
import type { PackageBindingTarget } from '../types/package-binding-target';
import { createPackageAliases } from './create-package-aliases.util';
import { createPackageTypeScriptPaths } from './create-package-type-script-paths.util';

export const createPackageBinding = (
  target: PackageBindingTarget
): IPackageBinding => {
  const exampleRoot = fileURLToPath(new URL('../../..', import.meta.url));
  const repositoryRoot = resolve(exampleRoot, '..');
  const isV1 = target === 'v1';
  const packageSpecifier = isV1 ? 'rqb-v1' : 'rqb-v2';

  const packageRoot = resolve(
    exampleRoot,
    isV1 ? '../node_modules/rqb-v1' : 'node_modules/rqb-v2'
  );

  const runtimePackageRoot = isV1 ? packageRoot : repositoryRoot;
  const implementationRoot = resolve(runtimePackageRoot, isV1 ? '.' : 'dist');
  const reactRoot = resolve(repositoryRoot, 'node_modules/react');
  const reactDomRoot = resolve(repositoryRoot, 'node_modules/react-dom');
  const stylesheetPath = isV1
    ? undefined
    : resolve(implementationRoot, 'styles.css');

  return {
    target,
    implementationRoot,
    packageSpecifier,
    packageRoot,
    reactRoot,
    reactDomRoot,
    aliases: [
      { find: 'react-dom', replacement: reactDomRoot },
      { find: 'react', replacement: reactRoot },
      ...(stylesheetPath
        ? [
            {
              find: `${canonicalPackageName}/styles.css`,
              replacement: stylesheetPath,
            },
          ]
        : []),
      ...createPackageAliases(runtimePackageRoot),
    ],
    typeScriptPaths: createPackageTypeScriptPaths(runtimePackageRoot),
    stylesheetPath,
    ssrNoExternal: [
      'prism-react-renderer',
      'styled-components',
      ...(isV1 ? [/^rqb-v1(?:\/.*)?$/] : []),
      /^react$/,
      /^react\//,
      /^react-dom(?:\/.*)?$/,
      /^react-router(?:-dom)?$/,
    ],
  };
};
