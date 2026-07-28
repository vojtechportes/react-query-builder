import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapAddButton } from './bootstrap-add-button';

describe('#adapters/bootstrap/shared/components/bootstrap-add-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<BootstrapAddButton label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
