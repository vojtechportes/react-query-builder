import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapRemoveButton } from './bootstrap-remove-button';

describe('#adapters/bootstrap/shared/components/bootstrap-remove-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<BootstrapRemoveButton label="Remove" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
