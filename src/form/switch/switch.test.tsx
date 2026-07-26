import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Switch } from './switch';
import styles from './switch.module.css';

const getSwitchCss = () =>
  readFileSync(join(__dirname, 'switch.module.css'), 'utf8');

const getSwitch = () => screen.getByRole('switch') as HTMLButtonElement;

describe('#components/Switch', () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    'renders switched=%s disabled=%s classes and ARIA',
    (switched, disabled) => {
      render(
        <Switch disabled={disabled} onChange={jest.fn()} switched={switched} />
      );
      const switchButton = getSwitch();
      const knob = switchButton.firstElementChild as HTMLElement;

      expect(switchButton.getAttribute('data-test')).toBe('Switch');
      expect(switchButton.type).toBe('button');
      expect(switchButton.getAttribute('aria-checked')).toBe(String(switched));
      expect(switchButton.getAttribute('aria-disabled')).toBe(String(disabled));
      expect(switchButton.classList.contains(styles.switch)).toBe(true);
      expect(switchButton.classList.contains(styles.switched)).toBe(switched);
      expect(switchButton.classList.contains(styles.disabled)).toBe(disabled);
      expect(switchButton.getAttribute('style')).toBeNull();
      expect(knob.classList.contains(styles.knob)).toBe(true);
      expect(knob.classList.contains(styles.knobSwitched)).toBe(switched);
    }
  );

  it('composes incoming className without emitting inline theme variables', () => {
    render(
      <Switch
        disabled={false}
        onChange={jest.fn()}
        switched
        className="incoming-class"
      />
    );
    const switchButton = getSwitch();

    expect(switchButton.classList.contains('incoming-class')).toBe(true);
    expect(switchButton.getAttribute('style')).toBeNull();
  });

  it('emits the next value when clicked and guards disabled clicks', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Switch disabled={false} onChange={onChange} switched={false} />
    );

    fireEvent.click(getSwitch());
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(<Switch disabled onChange={onChange} switched />);
    fireEvent.click(getSwitch());
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports optional callbacks and native keyboard activation', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(<Switch disabled={false} switched={false} />);

    fireEvent.click(getSwitch());

    rerender(<Switch disabled={false} switched={false} onChange={onChange} />);
    getSwitch().focus();
    await user.keyboard('[Space]');

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(<Switch disabled={false} switched />);

    expect(markup).toContain('role="switch"');
    expect(markup).toContain('aria-checked="true"');
    expect(markup).not.toContain('--query-builder-color-primary-default');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.switch).toBe('switch');
    expect(styles.switched).toBe('switched');
    expect(styles.disabled).toBe('disabled');
    expect(styles.knob).toBe('knob');
    expect(styles.knobSwitched).toBe('knobSwitched');
  });

  it('defines knob endpoints, disabled states, focus ring, and timings', () => {
    const css = getSwitchCss();

    expect(css).toContain('width: 2.75rem');
    expect(css).toContain('height: 1.6rem');
    expect(css).toContain('.switch:focus-visible');
    expect(css).toContain('.switched');
    expect(css).toContain('.disabled .knob');
    expect(css).toContain('transform: translateX(1.15rem)');
    expect(css).toContain('transform 0.2s ease');
  });
});
