import * as subject from './index';

describe('#adapters/mui/shared/components/mui-text-mode-toggle-content/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['MuiTextModeToggleContent']);
  });
});
