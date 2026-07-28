import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdTextModeInput } from './antd-text-mode-input';

describe('#adapters/antd/shared/components/antd-text-mode-input', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<AntdTextModeInput value="status = 1" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'status = 2' },
    });

    expect(onChange).toHaveBeenCalledWith('status = 2');
  });
});
