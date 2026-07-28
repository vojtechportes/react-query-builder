import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiInput } from './mui-input';

describe('#adapters/mui/shared/components/mui-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<MuiInput type="text" value="active" onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('active'), {
      target: { value: 'inactive' },
    });

    expect(onChange).toHaveBeenCalledWith('inactive');
  });
});
