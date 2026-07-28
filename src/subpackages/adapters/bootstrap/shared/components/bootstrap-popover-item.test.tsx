import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapPopoverItem } from './bootstrap-popover-item';

describe('#adapters/bootstrap/shared/components/bootstrap-popover-item', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<BootstrapPopoverItem label="Edit" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
