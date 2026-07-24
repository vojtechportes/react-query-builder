import { render } from '@testing-library/react';
import React from 'react';
import { colors } from '../constants/colors';
import { ThemeProvider } from '../theme-provider/theme-provider';
import { Builder } from './builder';

const requiredProps = {
  fields: [],
  data: [],
  onChange: jest.fn(),
};

describe('#components/Builder theme CSS variables', () => {
  it('applies theme variables once on the Builder root', () => {
    const themeColors = {
      ...colors,
      grey: {
        ...colors.grey,
        300: '#abcdef',
      },
    };
    const { container } = render(
      <ThemeProvider colors={themeColors}>
        <Builder {...requiredProps} />
      </ThemeProvider>
    );
    const builderRoot = container.firstElementChild as HTMLElement;

    expect(
      builderRoot.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#abcdef');
    expect(container.querySelector('[data-test="ActiveDropZone"]')).toBeNull();
  });

  it('does not suppress inherited variables without provider overrides', () => {
    const { container } = render(<Builder {...requiredProps} />);
    const builderRoot = container.firstElementChild as HTMLElement;

    expect(builderRoot.style.length).toBe(0);
  });
});
