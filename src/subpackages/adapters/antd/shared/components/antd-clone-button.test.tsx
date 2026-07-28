import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdCloneButton } from './antd-clone-button';

describe('#adapters/antd/shared/components/antd-clone-button', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <AntdCloneButton nodeType="rule" title="Clone rule" onClick={onClick} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clone rule' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
