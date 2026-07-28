import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdOutlinedButton } from './antd-outlined-button';

describe('#adapters/antd/shared/components/antd-outlined-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<AntdOutlinedButton label="Apply" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
