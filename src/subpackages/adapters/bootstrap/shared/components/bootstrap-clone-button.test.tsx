import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapCloneButton } from './bootstrap-clone-button';

describe('#adapters/bootstrap/shared/components/bootstrap-clone-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <BootstrapCloneButton
        nodeType="rule"
        title="Clone rule"
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clone rule' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
