import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapAlert } from './bootstrap-alert';

describe('#adapters/bootstrap/shared/components/bootstrap-alert', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapAlert severity="warning" variant="outlined" data-test="alert">
        Warning
      </BootstrapAlert>
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
