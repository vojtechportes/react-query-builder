import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiAddButton } from './mui-add-button';

describe('#adapters/mui/shared/components/mui-add-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<MuiAddButton label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
