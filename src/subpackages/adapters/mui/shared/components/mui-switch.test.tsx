import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiSwitch } from './mui-switch';

describe('#adapters/mui/shared/components/mui-switch', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<MuiSwitch switched={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
