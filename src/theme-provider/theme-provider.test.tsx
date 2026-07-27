import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import { OutlinedButton } from '../outlined-button';
import { SecondaryButton } from '../secondary-button';
import { colors } from '../constants/colors';
import { useTheme } from './hooks/use-theme';
import { ThemeProvider } from './theme-provider';

const ThemeProbe = () => {
  const theme = useTheme();

  return (
    <span
      data-testid="theme-probe"
      data-primary={theme.colors.primary.default}
      data-grey={theme.colors.grey['300']}
    />
  );
};

describe('#components/ThemeProvider', () => {
  it('is DOMless', () => {
    const { container } = render(
      <ThemeProvider>
        <span>First</span>
        <span>Second</span>
      </ThemeProvider>
    );

    expect(container.children).toHaveLength(2);
    expect(container.firstElementChild?.textContent).toBe('First');
    expect(container.lastElementChild?.textContent).toBe('Second');
  });

  it('accepts partial overrides and resolves omitted legacy colors to defaults', () => {
    render(
      <ThemeProvider colors={{ primary: { default: '#123456' } }}>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-probe').getAttribute('data-primary')).toBe(
      '#123456'
    );
    expect(screen.getByTestId('theme-probe').getAttribute('data-grey')).toBe(
      colors.grey['300']
    );
  });

  it('keeps the nearest provider replacement semantics', () => {
    render(
      <ThemeProvider colors={{ primary: { default: '#123456' } }}>
        <ThemeProvider colors={{ grey: { 300: '#abcdef' } }}>
          <ThemeProbe />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-probe').getAttribute('data-primary')).toBe(
      colors.primary.default
    );
    expect(screen.getByTestId('theme-probe').getAttribute('data-grey')).toBe(
      '#abcdef'
    );
  });

  it('keeps legacy provider variables off standalone controls', () => {
    render(
      <ThemeProvider
        colors={{
          primary: { default: 'rgb(1, 2, 3)' },
          secondary: { light: 'rgb(4, 5, 6)' },
          grey: { 300: 'rgb(7, 8, 9)' },
        }}
      >
        <Button label="Primary" onClick={jest.fn()} />
        <SecondaryButton label="Secondary" onClick={jest.fn()} />
        <OutlinedButton label="Outlined" onClick={jest.fn()} />
      </ThemeProvider>
    );

    for (const name of ['Primary', 'Secondary', 'Outlined']) {
      const buttonStyle = screen.getByRole('button', { name }).style;

      expect(
        buttonStyle.getPropertyValue('--query-builder-color-primary-default')
      ).toBe('');
      expect(
        buttonStyle.getPropertyValue('--query-builder-color-secondary-light')
      ).toBe('');
      expect(
        buttonStyle.getPropertyValue('--query-builder-color-grey-300')
      ).toBe('');
      expect(
        buttonStyle.getPropertyValue('--query-builder-color-grey-400')
      ).toBe('');
    }
  });
});
