import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuilderLockState } from '../../read-only/utils/lock-state.util';
import { LockToggle } from './lock-toggle';
import styles from './lock-toggle.module.css';

const iconPaths: Record<BuilderLockState, string> = {
  unlocked:
    'M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z',
  self: 'M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
  all: 'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
};

describe('#components/LockToggle', () => {
  it.each([
    ['rule', 'unlocked', 'Lock rule'],
    ['rule', 'self', 'Unlock rule'],
    ['group', 'unlocked', 'Lock group'],
    ['group', 'self', 'Lock group and descendants'],
    ['group', 'all', 'Unlock group and descendants'],
  ] as const)(
    'uses the fallback title for a %s in the %s state',
    (nodeType, state, title) => {
      const { container } = render(
        <LockToggle nodeType={nodeType} state={state} />
      );
      const button = screen.getByRole('button', { name: title });

      expect(container.children).toHaveLength(1);
      expect(container.firstElementChild).toBe(button);
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('title', title);
      expect(button).toHaveClass(styles.lockToggle, styles[state]);
      expect(button).not.toHaveAttribute('style');
    }
  );

  it.each(['unlocked', 'self', 'all'] as const)(
    'preserves the %s state class and icon',
    (state) => {
      render(
        <LockToggle
          nodeType="group"
          state={state}
          className="incoming-class"
          title={`${state} title`}
          data-test="LockToggle"
        />
      );
      const button = screen.getByRole('button', { name: `${state} title` });
      const icon = button.querySelector('svg');

      expect(button).toHaveClass(
        styles.lockToggle,
        styles[state],
        'incoming-class'
      );
      expect(button).toHaveAttribute('data-test', 'LockToggle');
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon?.querySelector('path')).toHaveAttribute(
        'd',
        iconPaths[state]
      );
    }
  );

  it.each([
    ['rule', 'unlocked', 'self'],
    ['rule', 'self', 'unlocked'],
    ['group', 'unlocked', 'self'],
    ['group', 'self', 'all'],
    ['group', 'all', 'unlocked'],
  ] as const)('moves a %s from %s to %s', (nodeType, state, nextState) => {
    const onChange = jest.fn();
    render(
      <LockToggle
        nodeType={nodeType}
        state={state}
        onChange={onChange}
        title="Toggle lock"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle lock' }));

    expect(onChange).toHaveBeenCalledWith(nextState);
  });

  it('activates by keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <LockToggle nodeType="group" state="unlocked" onChange={onChange} />
    );
    const button = screen.getByRole('button', { name: 'Lock group' });

    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(button).toHaveFocus();
    expect(onChange).toHaveBeenNthCalledWith(1, 'self');
    expect(onChange).toHaveBeenNthCalledWith(2, 'self');
  });

  it('preserves focusability while suppressing disabled activation', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <LockToggle nodeType="group" state="all" onChange={onChange} disabled />
    );
    const button = screen.getByRole('button', {
      name: 'Unlock group and descendants',
    });

    fireEvent.click(button);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(button).not.toBeDisabled();
    expect(button).toHaveFocus();
    expect(button).toHaveClass(styles.lockToggle, styles.all, styles.disabled);
    expect(onChange).not.toHaveBeenCalled();
    expect(button).not.toHaveAttribute('style');
    expect(button.getAttributeNames()).not.toEqual(
      expect.arrayContaining(['$theme', '$state', '$disabled'])
    );
  });

  it('does nothing when no change handler is provided', () => {
    render(<LockToggle nodeType="rule" state="unlocked" />);

    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Lock rule' }))
    ).not.toThrow();
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.lockToggle).toBe('lockToggle');
    expect(styles.unlocked).toBe('unlocked');
    expect(styles.self).toBe('self');
    expect(styles.all).toBe('all');
    expect(styles.disabled).toBe('disabled');
  });
});
