import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../theme-provider/theme-provider';
import styles from './clone-button.module.css';
import { CloneButton } from './clone-button';

const clonePath =
  'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z';

describe('#components/CloneButton', () => {
  it.each([
    ['rule', 'Clone rule'],
    ['group', 'Clone group'],
  ] as const)('uses the fallback title for a %s', (nodeType, title) => {
    const { container } = render(<CloneButton nodeType={nodeType} />);
    const button = screen.getByRole('button', { name: title });

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', title);
  });

  it('preserves its public attributes, incoming class, and icon', () => {
    render(
      <CloneButton
        nodeType="rule"
        onClick={jest.fn()}
        className="incoming-class"
        title="Duplicate condition"
        data-test="CloneButton"
      />
    );
    const button = screen.getByRole('button', { name: 'Duplicate condition' });
    const icon = button.querySelector('svg');

    expect(button).toHaveClass(styles.cloneButton, 'incoming-class');
    expect(button).toHaveAttribute('title', 'Duplicate condition');
    expect(button).toHaveAttribute('data-test', 'CloneButton');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('path')).toHaveAttribute('d', clonePath);
  });

  it('activates by pointer and keyboard', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<CloneButton nodeType="rule" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Clone rule' });

    fireEvent.click(button);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(button).toHaveFocus();
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('preserves focusability while suppressing disabled activation', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<CloneButton nodeType="group" onClick={onClick} disabled />);
    const button = screen.getByRole('button', { name: 'Clone group' });

    fireEvent.click(button);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(button).not.toBeDisabled();
    expect(button).toHaveFocus();
    expect(button).toHaveClass(styles.cloneButton, styles.disabled);
    expect(onClick).not.toHaveBeenCalled();
    expect(button.getAttributeNames()).not.toEqual(
      expect.arrayContaining(['$theme', '$disabled'])
    );
  });

  it('serializes ThemeProvider overrides for standalone usage', () => {
    render(
      <ThemeProvider
        colors={{
          primary: { light: 'rgb(1, 2, 3)' },
          grey: { 300: 'rgb(4, 5, 6)' },
        }}
      >
        <CloneButton nodeType="rule" />
      </ThemeProvider>
    );
    const style = screen.getByRole('button', { name: 'Clone rule' }).style;

    expect(style.getPropertyValue('--query-builder-color-primary-light')).toBe(
      'rgb(1, 2, 3)'
    );
    expect(style.getPropertyValue('--query-builder-color-grey-300')).toBe(
      'rgb(4, 5, 6)'
    );
    expect(style.getPropertyValue('--query-builder-color-grey-400')).toBe('');
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.cloneButton).toBe('cloneButton');
    expect(styles.disabled).toBe('disabled');
  });
});
