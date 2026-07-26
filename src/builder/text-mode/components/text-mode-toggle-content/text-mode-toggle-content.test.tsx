import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import styles from './text-mode-toggle-content.module.css';
import { TextModeToggleContent } from './text-mode-toggle-content';

describe('#components/TextModeToggleContent', () => {
  it('renders the matching icon and label for both modes', () => {
    const { container, rerender } = render(
      <TextModeToggleContent mode="builder" label="Use SQL" />
    );
    const content = container.firstElementChild as HTMLElement;
    const builderModePath = content.querySelector('path')?.getAttribute('d');

    expect(content).toHaveClass(styles.content);
    expect(content.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Use SQL')).toHaveClass(styles.label);

    rerender(<TextModeToggleContent mode="text" label="Use builder" />);

    expect(content.querySelector('path')?.getAttribute('d')).not.toBe(
      builderModePath
    );
    expect(screen.getByText('Use builder')).toHaveClass(styles.label);
  });

  it('renders on the server without styled-components output', () => {
    const markup = renderToString(
      <TextModeToggleContent mode="builder" label="Use SQL" />
    );

    expect(markup).toContain(`class="${styles.content}"`);
    expect(markup).not.toContain('data-styled');
  });
});
