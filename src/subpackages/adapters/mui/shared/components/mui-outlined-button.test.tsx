import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiOutlinedButton } from './mui-outlined-button';

describe('#adapters/mui/shared/components/mui-outlined-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<MuiOutlinedButton label="Apply" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
