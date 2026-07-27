import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import styles from './button.module.css';
import { Button } from './button';

describe('#components/Button', () => {
  it('renders the label in one button element', () => {
    const { container } = render(<Button onClick={jest.fn()} label="Test" />);
    const button = screen.getByRole('button', { name: 'Test' });

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(button);
    expect(button).toHaveClass(styles.button);
  });

  it('prefers truthy children over the label', () => {
    render(
      <Button onClick={jest.fn()} label="Label">
        Child
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Label' })).toBeNull();
  });

  it('calls onClick when pressed', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} label="Test" />);

    fireEvent.click(screen.getByRole('button', { name: 'Test' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('preserves public attributes and incoming classes', () => {
    const { rerender } = render(
      <Button
        onClick={jest.fn()}
        label="Test"
        className="incoming-class"
        title="Button title"
        data-test="Button"
      />
    );
    const button = screen.getByRole('button', { name: 'Test' });

    expect(button).toHaveClass(styles.button, 'incoming-class');
    expect(button).toHaveAttribute('title', 'Button title');
    expect(button).toHaveAttribute('data-test', 'Button');
    expect(button).not.toHaveAttribute('disabled');

    rerender(<Button onClick={jest.fn()} label="Test" disabled />);

    expect(button).toBeDisabled();
  });

  it('uses native disabled behavior without leaking internal props', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} label="Test" disabled />);
    const button = screen.getByRole('button', { name: 'Test' });

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button.getAttributeNames()).toEqual(
      expect.arrayContaining(['class', 'disabled'])
    );
    expect(button.getAttributeNames()).not.toEqual(
      expect.arrayContaining(['$theme', '$disabled'])
    );
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.button).toBe('button');
  });
});
