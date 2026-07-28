import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdAddButton } from './antd-add-button';

describe('#adapters/antd/shared/components/antd-add-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<AntdAddButton label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
