import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AntdGroup } from './antd-group';

describe('#adapters/antd/shared/components/antd-group', () => {
  it('renders its adapter behavior', () => {
    render(
      <AntdGroup
        controlsLeft={<span>Left controls</span>}
        controlsRight={<span>Right controls</span>}
      >
        Group content
      </AntdGroup>
    );

    expect(screen.getByText('Group content')).toBeInTheDocument();
    expect(screen.getByText('Left controls')).toBeInTheDocument();
  });
});
