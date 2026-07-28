import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdSwitch } from './antd-switch';

describe('#adapters/antd/shared/components/antd-switch', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<AntdSwitch switched={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
