import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiRemoveButton } from './mui-remove-button';

describe('#adapters/mui/shared/components/mui-remove-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<MuiRemoveButton label="Remove" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
