import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MantineTextModeToggleContent } from './mantine-text-mode-toggle-content';
import styles from './mantine-text-mode-toggle-content.module.css';

describe('#mantine/components/MantineTextModeToggleContent', () => {
  it.each([
    { mode: 'builder' as const, path: 'M15,4V6H18V18H15V20H20V4' },
    { mode: 'text' as const, path: 'M22 20V4C22 2.9' },
  ])('renders the $mode mode icon and label', ({ mode, path }) => {
    const { container } = render(
      <MantineTextModeToggleContent mode={mode} label={`${mode} label`} />
    );
    const content = container.firstElementChild as HTMLElement;
    const icon = content.querySelector('svg');

    expect(content).toHaveClass(styles.content);
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('path')?.getAttribute('d')).toContain(path);
    expect(screen.getByText(`${mode} label`)).toHaveClass(styles.label);
  });

  it('renders without styled-components runtime classes during SSR', () => {
    const markup = renderToStaticMarkup(
      <MantineTextModeToggleContent mode="builder" label="Use SQL" />
    );

    expect(markup).toContain(`class="${styles.content}"`);
    expect(markup).not.toContain('sc-');
  });
});
