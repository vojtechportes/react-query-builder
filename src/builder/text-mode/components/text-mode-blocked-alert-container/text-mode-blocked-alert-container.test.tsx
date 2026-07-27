import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import styles from './text-mode-blocked-alert-container.module.css';
import { TextModeBlockedAlertContainer } from './text-mode-blocked-alert-container';

describe('#components/TextModeBlockedAlertContainer', () => {
  it('composes classes and forwards div props, children, and ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <TextModeBlockedAlertContainer
        ref={ref}
        className="consumer-alert-container"
        data-testid="alert-container"
      >
        Blocked alert
      </TextModeBlockedAlertContainer>
    );
    const container = getByTestId('alert-container');

    expect(container).toHaveClass(styles.container, 'consumer-alert-container');
    expect(container).toHaveTextContent('Blocked alert');
    expect(ref.current).toBe(container);
  });

  it('renders on the server without styled-components attributes', () => {
    const markup = renderToString(
      <TextModeBlockedAlertContainer>Blocked</TextModeBlockedAlertContainer>
    );

    expect(markup).toContain(`class="${styles.container}"`);
    expect(markup).not.toContain('data-styled');
  });

  it('exposes its CSS Module class', () => {
    expect(styles.container).toBe('container');
  });

  it('defines tokenized blocked-alert spacing', () => {
    const css = readFileSync(
      join(__dirname, 'text-mode-blocked-alert-container.module.css'),
      'utf8'
    );

    expect(css).toContain(
      'margin-bottom: var(--query-builder-spacing-lg, 1rem)'
    );
  });
});
