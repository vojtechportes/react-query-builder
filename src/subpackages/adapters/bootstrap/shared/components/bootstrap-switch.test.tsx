import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BootstrapSwitch } from './bootstrap-switch';

describe('#adapters/bootstrap/shared/components/bootstrap-switch', () => {
  it('renders its adapter behavior', () => {
    const onChange = jest.fn();

    render(<BootstrapSwitch switched={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
