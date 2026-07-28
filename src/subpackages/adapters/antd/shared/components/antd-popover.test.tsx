import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AntdPopover } from './antd-popover';

describe('#adapters/antd/shared/components/antd-popover', () => {
  it('renders its adapter behavior', () => {
    render(
      <AntdPopover label="Actions">
        <button type="button">Edit</button>
      </AntdPopover>
    );

    expect(
      screen.getByRole('button', { name: /Actions/i })
    ).toBeInTheDocument();
  });
});
