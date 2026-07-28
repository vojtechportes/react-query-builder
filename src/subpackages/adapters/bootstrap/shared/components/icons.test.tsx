import React from 'react';
import { render } from '@testing-library/react';
import { BootstrapCodeIcon, BootstrapLockIcon } from './icons';

describe('#adapters/bootstrap/shared/components/icons', () => {
  it('renders the requested Bootstrap icon classes', () => {
    const { container } = render(
      <>
        <BootstrapCodeIcon />
        <BootstrapLockIcon state="all" />
      </>
    );

    expect(container.querySelector('.bi-code-slash')).not.toBeNull();
    expect(container.querySelector('.bi-lock-fill')).not.toBeNull();
  });
});
