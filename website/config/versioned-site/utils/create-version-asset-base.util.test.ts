import { describe, expect, it } from 'vitest';
import { createVersionAssetBase } from './create-version-asset-base.util';

describe('createVersionAssetBase', () => {
  it.each([
    [undefined, 'v1', '/v1/'],
    ['/', 'v2', '/v2/'],
    ['/react-query-builder/', 'v1', '/react-query-builder/v1/'],
    ['react-query-builder', 'v2', '/react-query-builder/v2/'],
  ] as const)(
    'creates an isolated base from %s for %s',
    (base, target, expected) => {
      expect(createVersionAssetBase(base, target)).toBe(expected);
    }
  );
});
