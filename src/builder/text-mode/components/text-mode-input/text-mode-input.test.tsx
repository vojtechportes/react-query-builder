import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import styles from './text-mode-input.module.css';
import { TextModeInput } from './text-mode-input';

describe('#builder/text-mode/TextModeInput', () => {
  it('composes classes and preserves controlled textarea behavior', () => {
    const onChange = jest.fn();
    const { container } = render(
      <TextModeInput
        value="SELECT 1"
        onChange={onChange}
        className="consumer-root"
        inputClassName="consumer-field"
        inputDataTest="SqlInput"
      />
    );
    const root = container.firstElementChild as HTMLElement;
    const field = root.querySelector('textarea') as HTMLTextAreaElement;

    expect(root).toHaveClass(styles.root, 'consumer-root');
    expect(field).toHaveClass(styles.field, 'consumer-field');
    expect(field).toHaveAttribute('data-test', 'SqlInput');
    expect(field).toHaveValue('SELECT 1');
    expect(field).not.toBeDisabled();
    expect(field).not.toHaveAttribute('readonly');
    expect(field).toHaveAttribute('spellcheck', 'false');

    fireEvent.change(field, { target: { value: 'SELECT 2' } });

    expect(onChange).toHaveBeenCalledWith('SELECT 2');
  });

  it('preserves disabled, read-only, and spellcheck states', () => {
    const { container } = render(
      <TextModeInput
        value=""
        onChange={jest.fn()}
        disabled
        readOnly
        spellCheck
      />
    );
    const field = container.querySelector('textarea') as HTMLTextAreaElement;

    expect(field).toBeDisabled();
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveAttribute('spellcheck', 'true');
  });

  it('renders on the server without theme or styled-components attributes', () => {
    const markup = renderToString(
      <TextModeInput value="SELECT 1" onChange={jest.fn()} />
    );

    expect(markup).toContain(`class="${styles.root}"`);
    expect(markup).toContain(`class="${styles.field}"`);
    expect(markup).not.toContain('$theme');
    expect(markup).not.toContain('data-styled');
  });
});
