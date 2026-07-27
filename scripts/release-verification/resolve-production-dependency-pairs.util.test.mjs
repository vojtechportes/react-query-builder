import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveProductionDependencyPairs } from './resolve-production-dependency-pairs.util.mjs';

const packageRecord = (name, version, dependencies = {}) => ({
  name,
  version,
  dependencies,
});

describe('resolveProductionDependencyPairs', () => {
  it('resolves nested dependencies before hoisted dependencies', () => {
    const result = resolveProductionDependencyPairs({
      '': { dependencies: { parent: '1.0.0' } },
      'node_modules/parent': packageRecord('parent', '1.0.0', {
        child: '2.0.0',
      }),
      'node_modules/parent/node_modules/child': packageRecord('child', '2.0.0'),
      'node_modules/child': packageRecord('child', '1.0.0'),
    });

    assert.deepEqual([...result].sort(), ['child@2.0.0', 'parent@1.0.0']);
  });

  it('resolves hoisted dependencies and counts name/version pairs once', () => {
    const result = resolveProductionDependencyPairs({
      '': { dependencies: { first: '1.0.0', second: '1.0.0' } },
      'node_modules/first': packageRecord('first', '1.0.0', {
        shared: '1.0.0',
      }),
      'node_modules/second': packageRecord('second', '1.0.0', {
        shared: '1.0.0',
      }),
      'node_modules/first/node_modules/shared': packageRecord(
        'shared',
        '1.0.0'
      ),
      'node_modules/second/node_modules/shared': packageRecord(
        'shared',
        '1.0.0'
      ),
    });

    assert.deepEqual([...result].sort(), [
      'first@1.0.0',
      'second@1.0.0',
      'shared@1.0.0',
    ]);
  });

  it('includes required peers and excludes optional peers', () => {
    const result = resolveProductionDependencyPairs({
      '': {
        peerDependencies: { optional: '1.0.0', required: '1.0.0' },
        peerDependenciesMeta: { optional: { optional: true } },
      },
      'node_modules/optional': packageRecord('optional', '1.0.0'),
      'node_modules/required': packageRecord('required', '1.0.0'),
    });

    assert.deepEqual([...result], ['required@1.0.0']);
  });

  it('rejects a forbidden nested dependency', () => {
    assert.throws(
      () =>
        resolveProductionDependencyPairs({
          '': { dependencies: { parent: '1.0.0' } },
          'node_modules/parent': packageRecord('parent', '1.0.0', {
            'styled-components': '6.0.0',
          }),
          'node_modules/parent/node_modules/styled-components': packageRecord(
            'styled-components',
            '6.0.0'
          ),
        }),
      /must not contain styled-components/
    );
  });
});
