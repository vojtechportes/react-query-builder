import { describe, expect, it } from 'vitest';
import builderStyle from '../../../../../src/builder/types/builder-style.ts?raw';
import { cssVariablesReference } from './constants/css-variables-reference';

describe('v2 CSS variables reference', () => {
  it('lists every public IBuilderStyle variable exactly once', () => {
    const publicVariableNames = Array.from(
      builderStyle.matchAll(/'(--query-builder-[\w-]+)'/g),
      ([, name]) => name
    );
    const referenceVariableNames = Array.from(
      cssVariablesReference.matchAll(/^\s*(--query-builder-[\w-]+):/gm),
      ([, name]) => name
    );

    expect(referenceVariableNames).toEqual(publicVariableNames);
  });
});
