import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiGroup } from './mui-group';

describe('#adapters/mui/shared/components/mui-group', () => {
  it('renders its adapter behavior', () => {
    render(
      <MuiGroup
        controlsLeft={<span>Left controls</span>}
        controlsRight={<span>Right controls</span>}
      >
        Group content
      </MuiGroup>
    );

    expect(screen.getByText('Group content')).toBeInTheDocument();
    expect(screen.getByText('Left controls')).toBeInTheDocument();
  });
});
