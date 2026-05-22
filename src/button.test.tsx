import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './button';

describe('#components/Button', () => {
  it('renders the label', () => {
    render(<Button onClick={jest.fn()} label="Test" />);

    expect(screen.getByRole('button', { name: 'Test' })).toBeTruthy();
  });

  it('calls onClick when pressed', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} label="Test" />);

    fireEvent.click(screen.getByRole('button', { name: 'Test' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
