import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdInput } from './antd-input';

describe('#adapters/antd/shared/components/antd-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<AntdInput type="text" value="active" onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('active'), {
      target: { value: 'inactive' },
    });

    expect(onChange).toHaveBeenCalledWith('inactive');
  });
});
