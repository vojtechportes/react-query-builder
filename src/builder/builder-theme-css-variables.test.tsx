import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { colors } from '../constants/colors';
import { ThemeProvider } from '../theme-provider/theme-provider';
import { Builder } from './builder';
import builderStyles from './components/styled-builder/styled-builder.module.css';

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
    const { container } = render(
      <div
        style={
          { '--query-builder-root-padding': '2rem' } as React.CSSProperties
        }
      >
        <Builder {...requiredProps} />
      </div>
    );
    const builderRoot = container.querySelector(
      '[data-query-builder="root"]'
    ) as HTMLElement;

    expect(builderRoot.style.length).toBe(0);
    expect(
      builderRoot.parentElement?.style.getPropertyValue(
        '--query-builder-root-padding'
      )
    ).toBe('2rem');
  });

  it('serializes only partial provider values and preserves inherited CSS', () => {
    const { container } = render(
      <div
        style={
          {
            '--query-builder-color-primary-default': '#fedcba',
          } as React.CSSProperties
        }
      >
        <ThemeProvider colors={{ grey: { 300: '#abcdef' } }}>
          <Builder {...requiredProps} />
        </ThemeProvider>
      </div>
    );
    const builderRoot = container.querySelector(
      '[data-query-builder="root"]'
    ) as HTMLElement;

    expect(
      builderRoot.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#abcdef');
    expect(
      builderRoot.style.getPropertyValue(
        '--query-builder-color-primary-default'
      )
    ).toBe('');
    expect(
      builderRoot.parentElement?.style.getPropertyValue(
        '--query-builder-color-primary-default'
      )
    ).toBe('#fedcba');
  });

  it('uses only the nearest provider compatibility variables', () => {
    const { container } = render(
      <ThemeProvider colors={{ primary: { default: '#123456' } }}>
        <ThemeProvider colors={{ grey: { 300: '#abcdef' } }}>
          <Builder {...requiredProps} />
        </ThemeProvider>
      </ThemeProvider>
    );
    const builderRoot = container.querySelector(
      '[data-query-builder="root"]'
    ) as HTMLElement;

    expect(
      builderRoot.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#abcdef');
    expect(
      builderRoot.style.getPropertyValue(
        '--query-builder-color-primary-default'
      )
    ).toBe('');
  });

  it('preserves root class and style props with explicit styles taking precedence', () => {
    const themeColors = {
      ...colors,
      grey: {
        ...colors.grey,
        300: '#abcdef',
      },
    };
    const { container } = render(
      <ThemeProvider colors={themeColors}>
        <Builder
          {...requiredProps}
          className="consumer-builder"
          style={{
            color: 'rgb(1, 2, 3)',
            '--query-builder-color-grey-300': '#123456',
            '--query-builder-root-padding': '2rem',
            '--query-builder-root-radius': '12px',
            '--query-builder-shadow-root': '0 1px 2px #000000',
          }}
        />
      </ThemeProvider>
    );
    const builderRoot = container.querySelector(
      '[data-query-builder="root"]'
    ) as HTMLElement;

    expect(builderRoot).toHaveClass(builderStyles.builder, 'consumer-builder');
    expect(builderRoot.style.color).toBe('rgb(1, 2, 3)');
    expect(
      builderRoot.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#123456');
    expect(
      builderRoot.style.getPropertyValue('--query-builder-root-padding')
    ).toBe('2rem');
    expect(
      builderRoot.style.getPropertyValue('--query-builder-root-radius')
    ).toBe('12px');
    expect(
      builderRoot.style.getPropertyValue('--query-builder-shadow-root')
    ).toBe('0 1px 2px #000000');
  });

  it('renders the Builder root on the server without styled-components attributes', () => {
    const markup = renderToString(<Builder {...requiredProps} />);

    expect(markup).toContain('data-query-builder="root"');
    expect(markup).toContain(builderStyles.builder);
    expect(markup).not.toContain('data-styled');
    expect(markup).not.toContain('$theme');
  });
});
