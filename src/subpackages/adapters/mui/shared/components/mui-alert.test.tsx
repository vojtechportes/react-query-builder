import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiAlertComponent } from './mui-alert';

describe('#adapters/mui/shared/components/mui-alert', () => {
  it('renders its adapter behavior', () => {
    render(
      <MuiAlertComponent
        severity="warning"
        variant="outlined"
        data-test="alert"
      >
        Warning
      </MuiAlertComponent>
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
