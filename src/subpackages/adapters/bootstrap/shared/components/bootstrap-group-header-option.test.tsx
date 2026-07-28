import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapGroupHeaderOption } from './bootstrap-group-header-option';

describe('#adapters/bootstrap/shared/components/bootstrap-group-header-option', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <BootstrapGroupHeaderOption
        value="AND"
        onClick={onClick}
        disabled={false}
        isSelected
      >
        AND
      </BootstrapGroupHeaderOption>
    );
    fireEvent.click(screen.getByRole('button', { name: 'AND' }));

    expect(onClick).toHaveBeenCalledWith('AND');
  });
});
