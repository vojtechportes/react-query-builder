import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdRemoveButton } from './antd-remove-button';

describe('#adapters/antd/shared/components/antd-remove-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(<AntdRemoveButton label="Remove" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
