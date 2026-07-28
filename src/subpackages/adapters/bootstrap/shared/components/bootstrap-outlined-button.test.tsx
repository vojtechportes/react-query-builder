import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapOutlinedButton } from './bootstrap-outlined-button';

describe('#adapters/bootstrap/shared/components/bootstrap-outlined-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<BootstrapOutlinedButton label="Apply" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
