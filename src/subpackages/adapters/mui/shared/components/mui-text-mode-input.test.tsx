import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiTextModeInput } from './mui-text-mode-input';

describe('#adapters/mui/shared/components/mui-text-mode-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<MuiTextModeInput value="status = 1" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'status = 2' },
    });

    expect(onChange).toHaveBeenCalledWith('status = 2');
  });
});
