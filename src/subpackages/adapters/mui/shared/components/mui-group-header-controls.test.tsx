import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiGroupHeaderControls } from './mui-group-header-controls';

describe('#adapters/mui/shared/components/mui-group-header-controls', () => {
  it('renders its adapter behavior', () => {
    render(
      <MuiGroupHeaderControls>
        <button type="button">AND</button>
      </MuiGroupHeaderControls>
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
