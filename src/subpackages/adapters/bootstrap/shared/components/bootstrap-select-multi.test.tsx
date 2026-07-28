import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapSelectMulti } from './bootstrap-select-multi';

describe('#adapters/bootstrap/shared/components/bootstrap-select-multi', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapSelectMulti
        values={[{ value: 'active', label: 'Active' }]}
        selectedValue={['active']}
        onChange={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
