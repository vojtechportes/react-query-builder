import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapPopover } from './bootstrap-popover';

describe('#adapters/bootstrap/shared/components/bootstrap-popover', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapPopover label="Actions">
        <button type="button">Edit</button>
      </BootstrapPopover>
    );

    expect(
      screen.getByRole('button', { name: /Actions/i })
    ).toBeInTheDocument();
  });
});
