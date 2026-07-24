import { dirname, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectSourceImports } from './utils/collect-source-imports.util';
import { getImportBoundaryViolation } from './utils/get-import-boundary-violation.util';
import { getTargetPackageBoundaryViolation } from './utils/get-target-package-boundary-violation.util';

const exampleRoot = resolve(import.meta.dirname, '../..');
const sourceRoot = resolve(exampleRoot, 'src');

describe('versioned site import boundaries', () => {
  it('accepts every import in the version-owned and shared source trees', () => {
    const imports = ['shared', 'v1', 'v2'].flatMap((directory) =>
      collectSourceImports(resolve(sourceRoot, directory))
    );

    const violations = imports.flatMap(({ importer, source }) => {
      const violation = getImportBoundaryViolation(importer, source);

      return violation ? [`${violation}: ${importer} -> ${source}`] : [];
    });

    expect(violations).toEqual([]);
  });

  it('keeps v1-owned content out of transitional legacy implementations', () => {
    const v1Root = resolve(sourceRoot, 'v1');
    const forbiddenLegacyRoots = [
      resolve(sourceRoot, 'pages/home-page'),
      resolve(sourceRoot, 'pages/demo-page'),
      resolve(sourceRoot, 'components/demo-playground'),
      resolve(sourceRoot, 'components/builder-surface'),
      resolve(sourceRoot, 'components/mui-builder-surface'),
      resolve(sourceRoot, 'components/theme-editor'),
      resolve(sourceRoot, 'components/bootstrap-demo-scope'),
      resolve(sourceRoot, 'constants/demo-data'),
      resolve(sourceRoot, 'constants/locale-options'),
      resolve(sourceRoot, 'constants/locale-strings'),
      resolve(sourceRoot, 'utils/builder-source'),
      resolve(sourceRoot, 'utils/query-formatters'),
      resolve(sourceRoot, 'pages/documentation-page'),
      resolve(sourceRoot, 'pages/api-page'),
      resolve(sourceRoot, 'components/imperative-field-options-demo'),
      resolve(sourceRoot, 'components/shared-field-options-demo'),
      resolve(sourceRoot, 'components/parsing-sandbox'),
      resolve(sourceRoot, 'components/load-imperative-field-options-demo'),
      resolve(sourceRoot, 'components/load-shared-field-options-demo'),
      resolve(sourceRoot, 'components/load-parsing-sandbox'),
      resolve(sourceRoot, 'components/utils/wait-for-timeout.util'),
      resolve(sourceRoot, 'constants/related-recipes-by-path'),
    ];
    const violations = collectSourceImports(v1Root).flatMap(
      ({ importer, source }) => {
        if (!source.startsWith('.')) {
          return source === 'rqb-v2' || source.startsWith('rqb-v2/')
            ? [`${importer} -> ${source}`]
            : [];
        }

        const importedPath = resolve(dirname(importer), source);
        const importsLegacyContent = forbiddenLegacyRoots.some(
          (legacyRoot) =>
            importedPath === legacyRoot ||
            importedPath.startsWith(`${legacyRoot}${sep}`)
        );

        return importsLegacyContent ? [`${importer} -> ${source}`] : [];
      }
    );

    expect(violations).toEqual([]);
  });

  it('keeps v2-owned content out of transitional legacy implementations', () => {
    const v2Root = resolve(sourceRoot, 'v2');
    const forbiddenLegacyRoots = [
      resolve(sourceRoot, 'pages/home-page'),
      resolve(sourceRoot, 'pages/demo-page'),
      resolve(sourceRoot, 'components/demo-playground'),
      resolve(sourceRoot, 'components/builder-surface'),
      resolve(sourceRoot, 'components/mui-builder-surface'),
      resolve(sourceRoot, 'components/theme-editor'),
      resolve(sourceRoot, 'components/bootstrap-demo-scope'),
      resolve(sourceRoot, 'constants/demo-data'),
      resolve(sourceRoot, 'constants/locale-options'),
      resolve(sourceRoot, 'constants/locale-strings'),
      resolve(sourceRoot, 'utils/builder-source'),
      resolve(sourceRoot, 'utils/query-formatters'),
      resolve(sourceRoot, 'pages/documentation-page'),
      resolve(sourceRoot, 'components/imperative-field-options-demo'),
      resolve(sourceRoot, 'components/shared-field-options-demo'),
      resolve(sourceRoot, 'components/parsing-sandbox'),
      resolve(sourceRoot, 'components/load-imperative-field-options-demo'),
      resolve(sourceRoot, 'components/load-shared-field-options-demo'),
      resolve(sourceRoot, 'components/load-parsing-sandbox'),
      resolve(sourceRoot, 'components/utils/wait-for-timeout.util'),
      resolve(sourceRoot, 'constants/related-recipes-by-path'),
    ];
    const violations = collectSourceImports(v2Root).flatMap(
      ({ importer, source }) => {
        if (!source.startsWith('.')) {
          return source === 'rqb-v1' || source.startsWith('rqb-v1/')
            ? [`${importer} -> ${source}`]
            : [];
        }

        const importedPath = resolve(dirname(importer), source);
        const importsLegacyContent = forbiddenLegacyRoots.some(
          (legacyRoot) =>
            importedPath === legacyRoot ||
            importedPath.startsWith(`${legacyRoot}${sep}`)
        );

        return importsLegacyContent ? [`${importer} -> ${source}`] : [];
      }
    );

    expect(violations).toEqual([]);
  });

  it.each([
    ['src/v1/app.tsx', '../v2/app', 'v1 modules cannot import v2 modules'],
    ['src/v2/app.tsx', '../v1/app', 'v2 modules cannot import v1 modules'],
    [
      'src/shared/client.tsx',
      '../v1/app',
      'shared modules cannot import version-owned or legacy application modules',
    ],
    [
      'src/shared/client.tsx',
      '@vojtechportes/react-query-builder',
      'shared modules cannot import a query-builder package binding',
    ],
  ])(
    'rejects the deliberate boundary violation %s -> %s',
    (importer, source, expectedViolation) => {
      expect(
        getImportBoundaryViolation(resolve(exampleRoot, importer), source)
      ).toBe(expectedViolation);
    }
  );

  it.each([
    ['v1', 'rqb-v2'],
    ['v2', 'rqb-v1'],
  ] as const)(
    'rejects %s loading the opposite package through a legacy importer',
    (target, source) => {
      expect(getTargetPackageBoundaryViolation(target, source)).toBe(
        `${target} modules cannot import the ${source} package binding`
      );
    }
  );

  it('allows version entries to use transitional legacy content', () => {
    expect(
      getImportBoundaryViolation(
        resolve(sourceRoot, 'v1/entry-client.tsx'),
        '../app/app'
      )
    ).toBeUndefined();
  });
});
