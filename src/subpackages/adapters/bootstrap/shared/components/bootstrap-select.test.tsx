import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapSelect } from './bootstrap-select';

describe('#adapters/bootstrap/shared/components/bootstrap-select', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapSelect
        values={[{ value: 'active', label: 'Active' }]}
        selectedValue="active"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
