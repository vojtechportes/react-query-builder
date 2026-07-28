import * as subject from './index';

describe('#adapters/fluent-ui/shared/components/fluent-ui-select-multi/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['FluentUiSelectMulti']);
  });
});
