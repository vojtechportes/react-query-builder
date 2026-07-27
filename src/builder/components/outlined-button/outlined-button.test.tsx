import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import buttonStyles from '../button/button.module.css';
import styles from './outlined-button.module.css';
import { OutlinedButton } from './outlined-button';

describe('#components/OutlinedButton', () => {
  it('composes base, variant, and incoming classes on one button', () => {
    const { container } = render(
      <OutlinedButton
        onClick={jest.fn()}
        label="Undo"
        className="incoming-class"
        title="Undo change"
        data-test="OutlinedButton"
      />
    );
    const button = screen.getByRole('button', { name: 'Undo' });

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(button);
    expect(button).toHaveClass(
      buttonStyles.button,
      styles.outlinedButton,
      'incoming-class'
    );
    expect(button).toHaveAttribute('title', 'Undo change');
    expect(button).toHaveAttribute('data-test', 'OutlinedButton');
  });

  it('preserves children, click, and native disabled behavior', () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <OutlinedButton onClick={onClick} label="Label">
        Child
      </OutlinedButton>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Child' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<OutlinedButton onClick={onClick} label="Undo" disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.outlinedButton).toBe('outlinedButton');
  });
});
