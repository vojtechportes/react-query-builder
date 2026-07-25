import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';
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

  it('supports a standalone exported control with partial colors', () => {
    render(
      <ThemeProvider colors={{ primary: { default: 'rgb(1, 2, 3)' } }}>
        <Button label="Standalone" onClick={jest.fn()} />
      </ThemeProvider>
    );
    const buttonStyle = getComputedStyle(
      screen.getByRole('button', { name: 'Standalone' })
    );

    expect(buttonStyle.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(buttonStyle.color).toBe('rgb(255, 255, 255)');
  });
});
