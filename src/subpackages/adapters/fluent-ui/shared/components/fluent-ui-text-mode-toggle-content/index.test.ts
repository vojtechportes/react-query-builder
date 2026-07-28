import * as subject from './index';

describe('#adapters/fluent-ui/shared/components/fluent-ui-text-mode-toggle-content/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      ['FluentUiTextModeToggleContent'].sort()
    );
  });
});
