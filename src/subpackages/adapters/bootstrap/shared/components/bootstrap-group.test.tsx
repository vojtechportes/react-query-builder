import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapGroup } from './bootstrap-group';

describe('#adapters/bootstrap/shared/components/bootstrap-group', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapGroup
        controlsLeft={<span>Left controls</span>}
        controlsRight={<span>Right controls</span>}
      >
        Group content
      </BootstrapGroup>
    );

    expect(screen.getByText('Group content')).toBeInTheDocument();
    expect(screen.getByText('Left controls')).toBeInTheDocument();
  });
});
