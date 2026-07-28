import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdPopoverItem } from './antd-popover-item';

describe('#adapters/antd/shared/components/antd-popover-item', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<AntdPopoverItem label="Edit" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
