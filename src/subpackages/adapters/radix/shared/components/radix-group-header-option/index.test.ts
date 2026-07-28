import * as subject from './index';

describe('#adapters/radix/shared/components/radix-group-header-option/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['RadixGroupHeaderOption']);
  });
});
