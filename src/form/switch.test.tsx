import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Switch } from './switch';

describe('#components/Switch', () => {
  it('renders the switch control', () => {
    const { container } = render(
      <Switch disabled={false} onChange={jest.fn()} switched={false} />
    );

    expect(container.querySelector('[data-test="Switch"]')).toBeTruthy();
  });

  it('emits a change when clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Switch disabled={false} onChange={onChange} switched={false} />
    );

    fireEvent.click(container.querySelector('[data-test="Switch"]') as HTMLElement);

    expect(onChange).toHaveBeenCalled();
  });
});
