import { createBuilderRootStyle } from './create-builder-root-style.util';

describe('#utils/createBuilderRootStyle', () => {
  it('lets explicit Builder styles override ThemeProvider compatibility variables', () => {
    expect(
      createBuilderRootStyle(
        { '--query-builder-color-grey-300': '#abcdef' },
        {
          '--query-builder-color-grey-300': '#123456',
          padding: '2rem',
        }
      )
    ).toEqual({
      '--query-builder-color-grey-300': '#123456',
      padding: '2rem',
    });
  });

  it('returns no inline values when neither source has overrides', () => {
    expect(createBuilderRootStyle({})).toEqual({});
  });
});
