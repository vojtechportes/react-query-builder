import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MuiCloneButton } from './mui-clone-button';

describe('#adapters/mui/shared/components/mui-clone-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <MuiCloneButton nodeType="rule" title="Clone rule" onClick={onClick} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clone rule' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
