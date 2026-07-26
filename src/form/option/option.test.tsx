import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Option } from './option';
import styles from './option.module.css';

const getOptionCss = () =>
  readFileSync(join(__dirname, 'option.module.css'), 'utf8');

describe('#components/Option', () => {
  it('renders children in a styled span without inline theme variables', () => {
    render(<Option>Active filter</Option>);
    const option = screen.getByText('Active filter');

    expect(option.tagName).toBe('SPAN');
    expect(option.classList.contains(styles.option)).toBe(true);
    expect(option.getAttribute('style')).toBeNull();
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(<Option>Server option</Option>);

    expect(markup).toContain('Server option');
    expect(markup).not.toContain('--query-builder-color-grey-700');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.option).toBe('option');
  });

  it('defines preserved token-backed option presentation rules', () => {
    const css = getOptionCss();

    expect(css).toContain('padding: 0.3rem 0.5rem');
    expect(css).toContain('color: var(--query-builder-color-grey-700)');
    expect(css).toContain('font-size: 0.7rem');
    expect(css).toContain('line-height: 0.7rem');
    expect(css).toContain('white-space: nowrap');
    expect(css).toContain(
      'border: 1px solid var(--query-builder-color-grey-700)'
    );
    expect(css).toContain('border-radius: 3rem');
  });
});
