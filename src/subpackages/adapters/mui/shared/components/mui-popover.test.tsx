import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiPopover } from './mui-popover';

describe('#adapters/mui/shared/components/mui-popover', () => {
  it('renders its adapter behavior', () => {
    render(
      <MuiPopover label="Actions">
        <button type="button">Edit</button>
      </MuiPopover>
    );

    expect(
      screen.getByRole('button', { name: /Actions/i })
    ).toBeInTheDocument();
  });
});
