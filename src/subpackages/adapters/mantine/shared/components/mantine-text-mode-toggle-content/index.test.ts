import * as subject from './index';

describe('#adapters/mantine/shared/components/mantine-text-mode-toggle-content/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      ['MantineTextModeToggleContent'].sort()
    );
  });
});
