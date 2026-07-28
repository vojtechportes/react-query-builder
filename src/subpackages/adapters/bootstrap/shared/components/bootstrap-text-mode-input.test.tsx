import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapTextModeInput } from './bootstrap-text-mode-input';

describe('#adapters/bootstrap/shared/components/bootstrap-text-mode-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<BootstrapTextModeInput value="status = 1" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'status = 2' },
    });

    expect(onChange).toHaveBeenCalledWith('status = 2');
  });
});
