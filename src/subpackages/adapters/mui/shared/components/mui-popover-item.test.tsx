import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MenuList } from '@mui/material';
import { MuiPopoverItem } from './mui-popover-item';

describe('#adapters/mui/shared/components/mui-popover-item', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <MenuList>
        <MuiPopoverItem label="Edit" onClick={onClick} />
      </MenuList>
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
