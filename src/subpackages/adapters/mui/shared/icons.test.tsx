import React from 'react';
import { render } from '@testing-library/react';
import { CloneIcon, LockStateIcon } from './icons';

describe('#adapters/mui/shared/icons', () => {
  it('renders clone and lock-state SVG icons', () => {
    const { container } = render(
      <>
        <CloneIcon />
        <LockStateIcon state="self" />
      </>
    );

    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
});
