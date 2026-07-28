import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdLockToggle } from './antd-lock-toggle';

describe('#adapters/antd/shared/components/antd-lock-toggle', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(
      <AntdLockToggle
        state="unlocked"
        nodeType="rule"
        title="Lock rule"
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lock rule' }));

    expect(onChange).toHaveBeenCalledWith('self');
  });
});
