import * as subject from './index';

describe('#adapters/radix/shared/components/radix-history-controls/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['RadixHistoryControls']);
  });
});
