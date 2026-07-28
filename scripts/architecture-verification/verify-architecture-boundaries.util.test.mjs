import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { verifyArchitectureBoundaries } from './verify-architecture-boundaries.util.mjs';

test('enforces the source ownership and dependency matrix', () => {
  const repositoryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'rqb-architecture-')
  );
  const sourceRoot = path.join(repositoryRoot, 'src');
  const sourceFixtures = {
    'builder/builder.ts': "export { sharedValue } from '../shared/shared';\n",
    'builder/value.ts': 'export const builderValue = true;\n',
    'shared/shared.ts': 'export const sharedValue = true;\n',
    'subpackages/adapters/antd/shared/index.ts':
      "export { builderValue } from '../../../../builder/value';\n",
    'subpackages/adapters/antd/v5/index.ts':
      "export { builderValue } from '../shared';\n",
    'subpackages/adapters/mui/v7/index.ts': 'export const muiValue = true;\n',
    'subpackages/format-query/index.ts':
      "export { sharedValue } from '../../shared/shared';\n",
    'subpackages/locales/en-us/index.ts':
      "export { sharedValue } from '../../../shared/shared';\n",
    'subpackages/monaco/index.ts':
      "export { builderValue } from '../../builder/value';\n",
    'subpackages/parse-query/index.ts':
      "export { sharedValue } from '../../shared/shared';\n",
    'index.tsx':
      "export { builderValue } from './builder/value';\n" +
      "export { sharedValue } from './shared/shared';\n" +
      "export * from './subpackages/locales/en-us';\n",
  };

  try {
    for (const [relativePath, source] of Object.entries(sourceFixtures)) {
      const fixturePath = path.join(sourceRoot, relativePath);

      fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
      fs.writeFileSync(fixturePath, source);
    }

    assert.doesNotThrow(() => verifyArchitectureBoundaries(repositoryRoot));

    const violationFixtures = [
      {
        path: 'shared/invalid-shared.ts',
        source: "export { builderValue } from '../builder/value';\n",
        expected:
          /shared\/invalid-shared\.ts \(shared\) imports builder\/value\.ts \(builder\)/,
      },
      {
        path: 'builder/invalid-builder.ts',
        source: "export * from '../subpackages/monaco';\n",
        expected:
          /builder\/invalid-builder\.ts \(builder\) imports subpackages\/monaco\/index\.ts \(subpackage:monaco\)/,
      },
      {
        path: 'subpackages/adapters/antd/v5/invalid-adapter.ts',
        source: "export * from '../../mui/v7';\n",
        expected: /\(adapter:antd\) imports .* \(adapter:mui\)/,
      },
      {
        path: 'subpackages/locales/en-us/invalid-locale.ts',
        source: "export * from '../../monaco';\n",
        expected: /\(subpackage:locales\) imports .* \(subpackage:monaco\)/,
      },
      {
        path: 'subpackages/parse-query/invalid-parser.ts',
        source: "export * from '../../builder/value';\n",
        expected: /\(subpackage:parse-query\) imports .* \(builder\)/,
      },
      {
        path: 'subpackages/monaco/invalid-monaco.ts',
        source: "export * from '../adapters/mui/v7';\n",
        expected: /\(subpackage:monaco\) imports .* \(adapter:mui\)/,
      },
      {
        path: 'builder/public-entry-bypass.ts',
        source: "export * from '@vojtechportes/react-query-builder/monaco';\n",
        expected: /imports the public package specifier .*\/monaco/,
      },
      {
        path: 'builder/dynamic-import.ts',
        source:
          "export const loadMonaco = () => import('../subpackages/monaco');\n",
        expected: /\(builder\) imports .* \(subpackage:monaco\)/,
      },
      {
        path: 'builder/BadName.ts',
        source: 'export const invalidName = true;\n',
        expected: /does not use a kebab-case file name/,
      },
    ];

    for (const fixture of violationFixtures) {
      const fixturePath = path.join(sourceRoot, fixture.path);

      fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
      fs.writeFileSync(fixturePath, fixture.source);
      assert.throws(
        () => verifyArchitectureBoundaries(repositoryRoot),
        fixture.expected,
        fixture.path
      );
      fs.rmSync(fixturePath);
    }

    const legacyRoot = path.join(sourceRoot, 'legacy');

    fs.mkdirSync(legacyRoot);
    fs.writeFileSync(
      path.join(legacyRoot, 'legacy.test.ts'),
      'export const legacyTest = true;\n'
    );
    assert.throws(
      () => verifyArchitectureBoundaries(repositoryRoot),
      /legacy is not a recognized source root/
    );
    fs.rmSync(legacyRoot, { recursive: true });
  } finally {
    fs.rmSync(repositoryRoot, { force: true, recursive: true });
  }
});
