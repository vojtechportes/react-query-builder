import * as subject from './index';

describe('#adapters/radix/shared/components/radix-text-mode-toggle-content/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['RadixTextModeToggleContent']);
  });
});
