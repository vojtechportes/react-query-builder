import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapLockToggle } from './bootstrap-lock-toggle';

describe('#adapters/bootstrap/shared/components/bootstrap-lock-toggle', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(
      <BootstrapLockToggle
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
