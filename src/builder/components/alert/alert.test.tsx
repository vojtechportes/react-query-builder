import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Alert } from './alert';
import styles from './alert.module.css';
import { AlertSeverity } from './types/alert-severity';
import { AlertVariant } from './types/alert-variant';

const iconPaths: Record<AlertSeverity, string> = {
  info: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z',
  success:
    'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.1 14.3-4.2-4.2 1.4-1.4 2.8 2.8 5.7-5.7 1.4 1.4Z',
  warning: 'M1 21h22L12 2Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z',
  error: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z',
};

const severities: AlertSeverity[] = ['info', 'success', 'warning', 'error'];
const variants: AlertVariant[] = ['outlined', 'filled'];

describe('#components/Alert', () => {
  it('uses the warning outlined defaults and preserves its DOM structure', () => {
    const { container } = render(<Alert>Alert content</Alert>);
    const alert = container.firstElementChild as HTMLElement;

    expect(container.children).toHaveLength(1);
    expect(alert.tagName).toBe('DIV');
    expect(alert).toHaveClass(styles.alert, styles.warning, styles.outlined);
    expect(alert.children).toHaveLength(2);
    expect(alert.children[0]).toHaveClass(styles.icon);
    expect(alert.children[0]).toHaveAttribute('aria-hidden', 'true');
    expect(alert.children[1]).toHaveClass(styles.content);
    expect(alert.children[1]).toHaveTextContent('Alert content');
    expect(alert.getAttribute('style')).toBeNull();
  });

  it.each(
    severities.flatMap((severity) =>
      variants.map((variant) => [severity, variant] as const)
    )
  )('exposes the %s %s visual state', (severity, variant) => {
    const { container } = render(
      <Alert severity={severity} variant={variant}>
        State
      </Alert>
    );
    const alert = container.firstElementChild as HTMLElement;

    expect(alert).toHaveClass(styles.alert, styles[severity], styles[variant]);
    expect(alert.querySelector('path')).toHaveAttribute(
      'd',
      iconPaths[severity]
    );
  });

  it('preserves incoming attributes without leaking internal props', () => {
    const { container } = render(
      <Alert
        className="incoming-class"
        severity="success"
        variant="filled"
        data-test="StatusAlert"
      >
        Saved
      </Alert>
    );
    const alert = container.firstElementChild as HTMLElement;

    expect(alert).toHaveClass(
      styles.alert,
      styles.success,
      styles.filled,
      'incoming-class'
    );
    expect(alert).toHaveAttribute('data-test', 'StatusAlert');
    expect(alert.getAttributeNames()).not.toEqual(
      expect.arrayContaining(['$theme', '$severity', '$variant'])
    );
  });

  it('keeps the icon decorative with the baseline SVG contract', () => {
    const { container } = render(<Alert severity="info">Information</Alert>);
    const icon = container.querySelector(`.${styles.icon}`);
    const svg = icon?.querySelector('svg');

    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(
      <Alert severity="error" variant="filled" className="server-alert">
        Server error
      </Alert>
    );

    expect(markup).toContain('Server error');
    expect(markup).toContain('server-alert');
    expect(markup).toContain(`class="${styles.icon}"`);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain('$severity');
    expect(markup).not.toContain('--query-builder-color-error-primary');
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.alert).toBe('alert');
    expect(styles.content).toBe('content');
    expect(styles.icon).toBe('icon');
    expect(styles.info).toBe('info');
    expect(styles.success).toBe('success');
    expect(styles.warning).toBe('warning');
    expect(styles.error).toBe('error');
    expect(styles.outlined).toBe('outlined');
    expect(styles.filled).toBe('filled');
  });
});
