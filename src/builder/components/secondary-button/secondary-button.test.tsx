import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import buttonStyles from '../button/button.module.css';
import styles from './secondary-button.module.css';
import { SecondaryButton } from './secondary-button';

describe('#components/SecondaryButton', () => {
  it('composes base, variant, and incoming classes on one button', () => {
    const { container } = render(
      <SecondaryButton
        onClick={jest.fn()}
        label="Delete"
        className="incoming-class"
        title="Delete rule"
        data-test="SecondaryButton"
      />
    );
    const button = screen.getByRole('button', { name: 'Delete' });

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(button);
    expect(button).toHaveClass(
      buttonStyles.button,
      styles.secondaryButton,
      'incoming-class'
    );
    expect(button).toHaveAttribute('title', 'Delete rule');
    expect(button).toHaveAttribute('data-test', 'SecondaryButton');
  });

  it('preserves children, click, and native disabled behavior', () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <SecondaryButton onClick={onClick} label="Label">
        Child
      </SecondaryButton>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Child' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<SecondaryButton onClick={onClick} label="Delete" disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.secondaryButton).toBe('secondaryButton');
  });
});
