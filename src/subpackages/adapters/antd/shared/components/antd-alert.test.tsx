import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AntdAlert } from './antd-alert';

describe('#adapters/antd/shared/components/antd-alert', () => {
  it('renders its adapter behavior', () => {
    render(
      <AntdAlert severity="warning" variant="outlined" data-test="alert">
        Warning
      </AntdAlert>
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
