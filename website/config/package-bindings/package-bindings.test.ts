import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { canonicalPackageName } from './constants/canonical-package-name';
import { packageExports } from './constants/package-exports';
import { v1PackageBinding } from './v1-package-binding';
import { v2PackageBinding } from './v2-package-binding';

const bindings = [v1PackageBinding, v2PackageBinding];
const websiteRoot = resolve(import.meta.dirname, '../..');

describe('versioned package bindings', () => {
  it('pins v1 to the published 1.33.1 package', () => {
    const manifest = JSON.parse(
      readFileSync(
        resolve(v1PackageBinding.packageRoot, 'package.json'),
        'utf8'
      )
    ) as { version: string };

    expect(v1PackageBinding.packageSpecifier).toBe('rqb-v1');
    expect(manifest.version).toBe('1.33.1');
  });

  it('binds v2 to the local repository package', () => {
    const repositoryRoot = realpathSync(
      resolve(import.meta.dirname, '../../../')
    );

    expect(v2PackageBinding.packageSpecifier).toBe('rqb-v2');
    expect(realpathSync(v2PackageBinding.packageRoot)).toBe(repositoryRoot);
    expect(realpathSync(v2PackageBinding.implementationRoot)).toBe(
      realpathSync(resolve(repositoryRoot, 'dist'))
    );
  });

  it('maps every local source export to an existing file', () => {
    const sourceRoot = resolve(import.meta.dirname, '../../../src');

    expect(
      packageExports.every(({ localSourcePath }) =>
        existsSync(resolve(sourceRoot, localSourcePath))
      )
    ).toBe(true);
  });

  it.each(bindings)(
    'matches the actual package exports for $target',
    (binding) => {
      const manifest = JSON.parse(
        readFileSync(resolve(binding.packageRoot, 'package.json'), 'utf8')
      ) as { exports: Record<string, unknown> };

      const expectedExports = [
        ...packageExports.map(({ subpath }) =>
          subpath === '' ? '.' : `.${subpath}`
        ),
        ...(binding.target === 'v2' ? ['./styles.css'] : []),
      ];

      expect(Object.keys(manifest.exports).sort()).toEqual(
        expectedExports.sort()
      );
    }
  );

  it.each(bindings)('covers every public export for $target', (binding) => {
    const packageAliases = binding.aliases.filter(
      ({ find }) =>
        typeof find === 'string' && find.startsWith(canonicalPackageName)
    );

    expect(packageAliases.map(({ find }) => find)).toEqual([
      ...(binding.stylesheetPath ? [`${canonicalPackageName}/styles.css`] : []),
      ...packageExports.map(
        ({ subpath }) => `${canonicalPackageName}${subpath}`
      ),
    ]);
    expect(Object.keys(binding.typeScriptPaths)).toEqual(
      packageExports.map(({ subpath }) => `${canonicalPackageName}${subpath}`)
    );
    expect(
      Object.values(binding.typeScriptPaths).every(([path]) => existsSync(path))
    ).toBe(true);
  });

  it.each(bindings)(
    'roots every package replacement in the $target implementation',
    (binding) => {
      const packageReplacements = binding.aliases
        .filter(
          ({ find }) =>
            typeof find === 'string' && find.startsWith(canonicalPackageName)
        )
        .map(({ replacement }) => replacement);

      expect(
        packageReplacements.every(
          (path) =>
            path.startsWith(binding.implementationRoot) ||
            path === binding.stylesheetPath
        )
      ).toBe(true);
      expect(
        Object.values(binding.typeScriptPaths).every(([path]) =>
          path.startsWith(binding.implementationRoot)
        )
      ).toBe(true);
    }
  );

  it('resolves the public stylesheet only for v2', () => {
    expect(v1PackageBinding.stylesheetPath).toBeUndefined();
    expect(v2PackageBinding.stylesheetPath).toBe(
      resolve(v2PackageBinding.implementationRoot, 'styles.css')
    );
    expect(existsSync(v2PackageBinding.stylesheetPath!)).toBe(true);
  });

  it('keeps package runtimes mutually exclusive', () => {
    const v1Replacements = v1PackageBinding.aliases.map(
      ({ replacement }) => replacement
    );

    const v2Replacements = v2PackageBinding.aliases.map(
      ({ replacement }) => replacement
    );

    expect(v1Replacements.some((path) => path.includes('rqb-v2'))).toBe(false);
    expect(v2Replacements.some((path) => path.includes('rqb-v1'))).toBe(false);
  });

  it('selects one shared React pair for each isolated target', () => {
    const reactManifest = JSON.parse(
      readFileSync(resolve(v1PackageBinding.reactRoot, 'package.json'), 'utf8')
    ) as { version: string };

    const reactDomManifest = JSON.parse(
      readFileSync(
        resolve(v1PackageBinding.reactDomRoot, 'package.json'),
        'utf8'
      )
    ) as { version: string };

    expect(v1PackageBinding.reactRoot).toBe(
      resolve(websiteRoot, 'node_modules/react')
    );
    expect(v1PackageBinding.reactDomRoot).toBe(
      resolve(websiteRoot, 'node_modules/react-dom')
    );
    expect(v1PackageBinding.reactRoot).toBe(v2PackageBinding.reactRoot);
    expect(v1PackageBinding.reactDomRoot).toBe(v2PackageBinding.reactDomRoot);
    expect(reactManifest.version).toBe('19.2.6');
    expect(reactDomManifest.version).toBe('19.2.6');
  });

  it.each(bindings)('uses one Mantine runtime for $target', (binding) => {
    const coreManifest = JSON.parse(
      readFileSync(resolve(binding.mantineCoreRoot, 'package.json'), 'utf8')
    ) as { version: string };

    const hooksManifest = JSON.parse(
      readFileSync(resolve(binding.mantineHooksRoot, 'package.json'), 'utf8')
    ) as { version: string };

    expect(binding.mantineCoreRoot).toBe(
      resolve(websiteRoot, 'node_modules/@mantine/core')
    );
    expect(binding.mantineHooksRoot).toBe(
      resolve(websiteRoot, 'node_modules/@mantine/hooks')
    );
    expect(binding.aliases.slice(2, 4)).toEqual([
      { find: '@mantine/core', replacement: binding.mantineCoreRoot },
      { find: '@mantine/hooks', replacement: binding.mantineHooksRoot },
    ]);
    expect(coreManifest.version).toBe('9.2.2');
    expect(hooksManifest.version).toBe('9.2.2');
  });
  it.each(bindings)('uses one React runtime for $target', (binding) => {
    expect(binding.aliases.slice(0, 2)).toEqual([
      { find: 'react-dom', replacement: binding.reactDomRoot },
      { find: 'react', replacement: binding.reactRoot },
    ]);
    expect(existsSync(resolve(binding.reactRoot, 'package.json'))).toBe(true);
    expect(existsSync(resolve(binding.reactDomRoot, 'package.json'))).toBe(
      true
    );
  });
});
