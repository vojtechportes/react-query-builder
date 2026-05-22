import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from './input';

describe('#components/Input', () => {
  it('renders a text input with the provided value', () => {
    render(
      <Input
        disabled={false}
        type="text"
        onChange={jest.fn()}
        value="Test"
      />
    );

    expect(screen.getByDisplayValue('Test')).toBeTruthy();
  });

  it('emits changes from the input', () => {
    const onChange = jest.fn();
    render(
      <Input disabled={false} type="text" onChange={onChange} value="Test" />
    );

    const input = screen.getByDisplayValue('Test');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onChange).toHaveBeenCalled();
  });
});
