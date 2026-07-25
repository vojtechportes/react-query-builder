import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AntdTextModeToggleContent } from './antd-text-mode-toggle-content';
import styles from './antd-text-mode-toggle-content.module.css';

describe('#antd/components/AntdTextModeToggleContent', () => {
  it.each([
    { mode: 'builder' as const, iconLabel: 'code' },
    { mode: 'text' as const, iconLabel: 'appstore' },
  ])('renders the $mode mode icon and label', ({ mode, iconLabel }) => {
    const { container } = render(
      <AntdTextModeToggleContent mode={mode} label={`${mode} label`} />
    );
    const content = container.firstElementChild as HTMLElement;
    const icon = content.querySelector(`[aria-label="${iconLabel}"]`);

    expect(content).toHaveClass(styles.content);
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(`${mode} label`)).toHaveClass(styles.label);
  });
});
