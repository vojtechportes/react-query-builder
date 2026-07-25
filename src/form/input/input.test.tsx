import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ThemeProvider } from '../../theme-provider/theme-provider';
import sharedInputStyles from '../../styles/input.module.css';
import { Input } from './input';
import inputStyles from './input.module.css';

const getSharedInputCss = () =>
  readFileSync(
    join(__dirname, '..', '..', 'styles', 'input.module.css'),
    'utf8'
  );

const getInputCss = () =>
  readFileSync(join(__dirname, 'input.module.css'), 'utf8');

describe('#components/Input', () => {
  it('renders text, number, and date values with native attributes', () => {
    const { rerender } = render(
      <Input
        disabled={false}
        type="text"
        onChange={jest.fn()}
        value="Test"
        id="query-value"
        name="queryValue"
        className="incoming-class"
      />
    );
    const textInput = screen.getByDisplayValue('Test') as HTMLInputElement;

    expect(textInput.type).toBe('text');
    expect(textInput.id).toBe('query-value');
    expect(textInput.name).toBe('queryValue');
    expect(textInput.classList.contains(sharedInputStyles.control)).toBe(true);
    expect(textInput.classList.contains(sharedInputStyles.typography)).toBe(
      true
    );
    expect(textInput.classList.contains(inputStyles.input)).toBe(true);
    expect(textInput.classList.contains('incoming-class')).toBe(true);

    rerender(
      <Input disabled={false} type="number" onChange={jest.fn()} value={12} />
    );
    expect((screen.getByDisplayValue('12') as HTMLInputElement).type).toBe(
      'number'
    );

    rerender(
      <Input
        disabled={false}
        type="date"
        onChange={jest.fn()}
        value="2026-07-25"
      />
    );
    expect(
      (screen.getByDisplayValue('2026-07-25') as HTMLInputElement).type
    ).toBe('date');
  });

  it('emits string changes from the input', () => {
    const onChange = jest.fn();
    render(
      <Input disabled={false} type="number" onChange={onChange} value={12} />
    );

    fireEvent.change(screen.getByDisplayValue('12'), {
      target: { value: '13' },
    });

    expect(onChange).toHaveBeenCalledWith('13');
  });

  it('preserves disabled state and serializes explicit theme variables', () => {
    render(
      <ThemeProvider colors={{ grey: { 100: '#f1f1f1', 800: '#111111' } }}>
        <Input disabled type="text" onChange={jest.fn()} value="Disabled" />
      </ThemeProvider>
    );
    const input = screen.getByDisplayValue('Disabled') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(input.style.getPropertyValue('--query-builder-color-grey-100')).toBe(
      '#f1f1f1'
    );
    expect(input.style.getPropertyValue('--query-builder-color-grey-800')).toBe(
      '#111111'
    );
    expect(input.style.getPropertyValue('--query-builder-color-white')).toBe(
      ''
    );
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(
      <ThemeProvider colors={{ grey: { 500: '#aaaaaa' } }}>
        <Input disabled={false} type="text" onChange={jest.fn()} value="SSR" />
      </ThemeProvider>
    );

    expect(markup).toContain('value="SSR"');
    expect(markup).toContain('--query-builder-color-grey-500:#aaaaaa');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes the CSS Module class contract', () => {
    expect(sharedInputStyles.control).toBe('control');
    expect(sharedInputStyles.typography).toBe('typography');
    expect(inputStyles.input).toBe('input');
  });

  it('defines shared sizing, disabled, date, and number-input rules', () => {
    const sharedCss = getSharedInputCss();
    const inputCss = getInputCss();

    expect(sharedCss).toContain(
      'width: var(--query-builder-control-width, 160px)'
    );
    expect(sharedCss).toContain(
      'min-width: var(--query-builder-control-min-width, 160px)'
    );
    expect(sharedCss).toContain('.control:disabled');
    expect(inputCss).toContain('::-webkit-date-and-time-value');
    expect(inputCss).toContain('::-webkit-inner-spin-button');
    expect(inputCss).toContain('-moz-appearance: textfield');
  });

  it('keeps native keyboard editing behavior', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Input disabled={false} type="text" onChange={onChange} value="Test" />
    );

    await user.click(screen.getByDisplayValue('Test'));
    await user.keyboard('s');

    expect(onChange).toHaveBeenCalled();
  });
});
