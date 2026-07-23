import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { canonicalPackageName } from './constants/canonical-package-name';
import { packageExports } from './constants/package-exports';
import { v1PackageBinding } from './v1-package-binding';
import { v2PackageBinding } from './v2-package-binding';

const bindings = [v1PackageBinding, v2PackageBinding];

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
  });

  it.each(bindings)(
    'matches the actual package exports for $target',
    (binding) => {
      const manifest = JSON.parse(
        readFileSync(resolve(binding.packageRoot, 'package.json'), 'utf8')
      ) as { exports: Record<string, unknown> };

      const expectedExports = packageExports.map(({ subpath }) =>
        subpath === '' ? '.' : `.${subpath}`
      );

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

    expect(packageAliases.map(({ find }) => find)).toEqual(
      packageExports.map(({ subpath }) => `${canonicalPackageName}${subpath}`)
    );
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
        packageReplacements.every((path) =>
          path.startsWith(binding.implementationRoot)
        )
      ).toBe(true);
      expect(
        Object.values(binding.typeScriptPaths).every(([path]) =>
          path.startsWith(binding.implementationRoot)
        )
      ).toBe(true);
    }
  );

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

    expect(v1PackageBinding.reactRoot).toBe(v2PackageBinding.reactRoot);
    expect(v1PackageBinding.reactDomRoot).toBe(v2PackageBinding.reactDomRoot);
    expect(reactManifest.version).toBe('18.3.1');
    expect(reactDomManifest.version).toBe('18.3.1');
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
