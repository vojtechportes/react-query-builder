import { describe, expect, it } from 'vitest';
import { ImperativeFieldOptionsDemo } from './components/imperative-field-options-demo';
import { ParsingSandbox } from './components/parsing-sandbox';
import { SharedFieldOptionsDemo } from './components/shared-field-options-demo';
import { loadImperativeFieldOptionsDemo } from './utils/load-imperative-field-options-demo.util';
import { loadParsingSandbox } from './utils/load-parsing-sandbox.util';
import { loadSharedFieldOptionsDemo } from './utils/load-shared-field-options-demo.util';

describe('v1 Documentation lazy loaders', () => {
  it('loads the v1-owned interactive documentation components', async () => {
    await expect(loadImperativeFieldOptionsDemo()).resolves.toEqual({
      default: ImperativeFieldOptionsDemo,
    });
    await expect(loadSharedFieldOptionsDemo()).resolves.toEqual({
      default: SharedFieldOptionsDemo,
    });
    await expect(loadParsingSandbox()).resolves.toEqual({
      default: ParsingSandbox,
    });
  });
});
