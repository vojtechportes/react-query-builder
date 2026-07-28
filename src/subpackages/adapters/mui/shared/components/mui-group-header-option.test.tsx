import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiGroupHeaderOption } from './mui-group-header-option';

describe('#adapters/mui/shared/components/mui-group-header-option', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <MuiGroupHeaderOption
        value="AND"
        onClick={onClick}
        disabled={false}
        isSelected
      >
        AND
      </MuiGroupHeaderOption>
    );
    fireEvent.click(screen.getByRole('button', { name: 'AND' }));

    expect(onClick).toHaveBeenCalledWith('AND');
  });
});
