import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapInput } from './bootstrap-input';

describe('#adapters/bootstrap/shared/components/bootstrap-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<BootstrapInput type="text" value="active" onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('active'), {
      target: { value: 'inactive' },
    });

    expect(onChange).toHaveBeenCalledWith('inactive');
  });
});
