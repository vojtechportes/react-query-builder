import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MuiTextModeToggleContent } from './mui-text-mode-toggle-content';
import styles from './mui-text-mode-toggle-content.module.css';

describe('#mui/components/MuiTextModeToggleContent', () => {
  it.each([
    { mode: 'builder' as const, iconName: 'CodeIcon' },
    { mode: 'text' as const, iconName: 'ViewAgendaIcon' },
  ])('renders the $mode mode icon and label', ({ mode, iconName }) => {
    const { container } = render(
      <MuiTextModeToggleContent mode={mode} label={`${mode} label`} />
    );
    const content = container.firstElementChild as HTMLElement;
    const icon = content.querySelector(`[data-testid="${iconName}"]`);

    expect(content).toHaveClass(styles.content);
    expect(icon).not.toBeNull();
    expect(icon).toHaveClass('MuiSvgIcon-root');
    expect(icon).toHaveStyle({ flexShrink: '0', fontSize: '1rem' });
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(`${mode} label`)).toHaveClass(styles.label);
  });

  it('renders without styled-components runtime classes during SSR', () => {
    const markup = renderToStaticMarkup(
      <MuiTextModeToggleContent mode="builder" label="Use SQL" />
    );

    expect(markup).toContain(`class="${styles.content}"`);
    expect(markup).not.toContain('sc-');
  });
});
