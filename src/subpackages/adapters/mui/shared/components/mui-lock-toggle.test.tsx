import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiLockToggle } from './mui-lock-toggle';

describe('#adapters/mui/shared/components/mui-lock-toggle', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(
      <MuiLockToggle
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
