import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import styles from './styled-builder.module.css';
import { StyledBuilder } from './styled-builder';

describe('#components/StyledBuilder', () => {
  it('composes the root class and forwards div props, style, children, and ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <StyledBuilder
        ref={ref}
        className="consumer-builder"
        data-testid="builder-root"
        data-query-builder="root"
        aria-label="Query builder"
        style={{ color: 'rgb(1, 2, 3)' }}
      >
        Builder content
      </StyledBuilder>
    );
    const root = getByTestId('builder-root');

    expect(root).toHaveClass(
      styles.builder,
      styles.container,
      'consumer-builder'
    );
    expect(root).toHaveAttribute('data-query-builder', 'root');
    expect(root).toHaveAttribute('aria-label', 'Query builder');
    expect(root).toHaveStyle({ color: 'rgb(1, 2, 3)' });
    expect(root).toHaveTextContent('Builder content');
    expect(ref.current).toBe(root);
  });

  it('keeps baseline styles and omits only the container class when default styles are disabled', () => {
    const { getByTestId } = render(
      <StyledBuilder
        className="consumer-builder"
        data-testid="builder-root"
        useDefaultStyles={false}
      />
    );

    expect(getByTestId('builder-root')).toHaveClass(
      styles.builder,
      'consumer-builder'
    );
    expect(getByTestId('builder-root')).not.toHaveClass(styles.container);
  });
  it('renders on the server without styled-components attributes', () => {
    const markup = renderToString(
      <StyledBuilder data-query-builder="root">Content</StyledBuilder>
    );

    expect(markup).toContain(`class="${styles.builder} ${styles.container}"`);
    expect(markup).toContain('data-query-builder="root"');
    expect(markup).not.toContain('data-styled');
    expect(markup).not.toContain('$theme');
  });

  it('exposes its CSS Module class', () => {
    expect(styles.builder).toBe('builder');
    expect(styles.container).toBe('container');
  });

  it('defines the root token fallbacks and shell presentation', () => {
    const css = readFileSync(
      join(__dirname, 'styled-builder.module.css'),
      'utf8'
    );

    const builderRule = css.match(/\.builder\s*\{(?<declarations>[^}]*)\}/)
      ?.groups?.declarations;
    const containerRule = css.match(/\.container\s*\{(?<declarations>[^}]*)\}/)
      ?.groups?.declarations;

    expect(builderRule).toContain('color: var(--query-builder-color-grey-800)');
    expect(builderRule).toContain(
      'font-family: var(--query-builder-font-family, Arial, sans-serif)'
    );
    expect(builderRule).toContain(
      'font-size: var(--query-builder-font-size, 16px)'
    );
    expect(builderRule).toContain(
      'line-height: var(--query-builder-line-height, normal)'
    );
    expect(builderRule).not.toContain('padding:');
    expect(builderRule).not.toContain('background:');
    expect(builderRule).not.toContain('border:');
    expect(builderRule).not.toContain('border-radius:');
    expect(builderRule).not.toContain('box-shadow:');

    expect(containerRule).toContain(
      'padding: var(--query-builder-root-padding, 1rem)'
    );
    expect(containerRule).toContain(
      'background: var(--query-builder-color-background)'
    );
    expect(containerRule).toContain(
      'border: 1px solid var(--query-builder-color-grey-100)'
    );
    expect(containerRule).toContain(
      'border-radius: var(--query-builder-root-radius, 0)'
    );
    expect(containerRule).toContain(
      'box-shadow: var(--query-builder-shadow-root, none)'
    );
  });
});
