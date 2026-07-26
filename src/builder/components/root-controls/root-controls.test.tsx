import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import styles from './root-controls.module.css';
import { RootControls } from './root-controls';

describe('#components/RootControls', () => {
  it('composes classes and forwards div props, children, and ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <RootControls
        ref={ref}
        className="consumer-controls"
        data-testid="root-controls"
        aria-label="Builder actions"
      >
        <button type="button">First</button>
        <button type="button">Second</button>
      </RootControls>
    );
    const controls = getByTestId('root-controls');

    expect(controls).toHaveClass(styles.rootControls, 'consumer-controls');
    expect(controls).toHaveAttribute('aria-label', 'Builder actions');
    expect(controls.children).toHaveLength(2);
    expect(ref.current).toBe(controls);
  });

  it('renders on the server without styled-components attributes', () => {
    const markup = renderToString(<RootControls>Actions</RootControls>);

    expect(markup).toContain(`class="${styles.rootControls}"`);
    expect(markup).not.toContain('data-styled');
  });

  it('exposes its CSS Module class', () => {
    expect(styles.rootControls).toBe('rootControls');
  });

  it('defines the root action grid and tokenized spacing', () => {
    const css = readFileSync(
      join(__dirname, 'root-controls.module.css'),
      'utf8'
    );

    expect(css).toContain('grid-auto-flow: column');
    expect(css).toContain('grid-auto-columns: min-content');
    expect(css).toContain('gap: var(--query-builder-control-gap, 0.5rem)');
    expect(css).toContain(
      'margin-bottom: var(--query-builder-spacing-sm, 0.5rem)'
    );
  });
});
