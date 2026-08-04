import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TEXT_MODE_INPUT_CLASS } from '../../constants/text-mode-input-class';
import { TEXT_MODE_INPUT_FIELD_CLASS } from '../../constants/text-mode-input-field-class';
import { ITextModeInputProps } from '../../types/text-mode-input-props';
import styles from './text-mode-editor.module.css';
import { TextModeEditor } from './text-mode-editor';

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

const baseProps = {
  diagnostics: [],
  errorMessage: null,
  onChange: jest.fn(),
};

describe('#builder/text-mode/TextModeEditor', () => {
  it('keeps the input, syntax, and diagnostic layers aligned for multiline SQL', () => {
    const value =
      "SELECT COUNT(price)\nFROM orders\nWHERE active = true AND price >= 12 AND name = 'Ada';";
    const onChange = jest.fn();
    const { container } = render(
      <TextModeEditor {...baseProps} value={value} onChange={onChange} />
    );
    const input = getByDataTest(container, 'TextModeEditor');
    const syntaxLayer = getByDataTest(container, 'TextModeSyntaxLayer');
    const diagnosticLayer = syntaxLayer.nextElementSibling as HTMLElement;

    expect(input).toHaveClass(TEXT_MODE_INPUT_FIELD_CLASS);
    expect(input.parentElement).toHaveClass(TEXT_MODE_INPUT_CLASS);
    expect(input).toHaveValue(value);
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(syntaxLayer).toHaveClass(styles.editorLayer);
    expect(syntaxLayer).toHaveAttribute('aria-hidden', 'true');
    expect(diagnosticLayer).toHaveClass(styles.diagnosticOverlay);
    expect(diagnosticLayer.textContent).toBe(value);

    for (const token of [
      'keyword',
      'function',
      'operator',
      'number',
      'string',
      'boolean',
      'punctuation',
    ]) {
      expect(syntaxLayer.querySelector(`.token.${token}`)).not.toBeNull();
    }

    fireEvent.change(input, { target: { value: 'SELECT 2' } });

    expect(onChange).toHaveBeenCalledWith('SELECT 2');
  });

  it('renders sorted, overlapping, out-of-range, and missing diagnostics', () => {
    const { container } = render(
      <TextModeEditor
        {...baseProps}
        value="SELECT value"
        diagnostics={[
          { code: 'late', message: 'Late', start: 7, end: 99 },
          { code: 'early', message: 'Early', start: -3, end: 6 },
          { code: 'overlap', message: 'Overlap', start: 3, end: 8 },
          { code: 'missing', message: 'Missing', start: 99, end: 99 },
        ]}
        errorMessage="Invalid SQL"
      />
    );

    expect(getByDataTest(container, 'TextModeDiagnostic[0]')).toHaveTextContent(
      'SELECT'
    );
    expect(getByDataTest(container, 'TextModeDiagnostic[1]').textContent).toBe(
      ' v'
    );
    expect(getByDataTest(container, 'TextModeDiagnostic[2]')).toHaveTextContent(
      'alue'
    );
    expect(getByDataTest(container, 'TextModeDiagnosticMarker[3]')).toHaveClass(
      styles.missingTokenMarker
    );
    expect(getByDataTest(container, 'TextModeError')).toHaveTextContent(
      'Invalid SQL'
    );
  });

  it('renders empty SQL and zero-width diagnostics without collapsing layers', () => {
    const { container } = render(
      <TextModeEditor
        {...baseProps}
        value=""
        diagnostics={[
          { code: 'missing', message: 'Missing token', start: 0, end: 0 },
        ]}
      />
    );

    expect(getByDataTest(container, 'TextModeSyntaxLayer').innerHTML).toBe(' ');
    expect(
      getByDataTest(container, 'TextModeDiagnosticMarker[0]')
    ).toHaveTextContent('\u200b');
  });

  it('composes a custom input component with stable compatibility classes', () => {
    const receivedProps: ITextModeInputProps[] = [];
    const CustomInput = (props: ITextModeInputProps) => {
      receivedProps.push(props);

      return (
        <div className={props.className} data-test="CustomTextModeInput">
          <textarea
            className={props.inputClassName}
            data-test={props.inputDataTest}
            value={props.value}
            readOnly={props.readOnly}
            onChange={(event) => props.onChange(event.target.value)}
          />
        </div>
      );
    };
    const { container } = render(
      <TextModeEditor
        {...baseProps}
        value="SELECT 1"
        readOnly
        TextModeInputComponent={CustomInput}
      />
    );

    expect(getByDataTest(container, 'CustomTextModeInput')).toHaveClass(
      TEXT_MODE_INPUT_CLASS
    );
    expect(getByDataTest(container, 'TextModeEditor')).toHaveClass(
      TEXT_MODE_INPUT_FIELD_CLASS
    );
    expect(getByDataTest(container, 'TextModeEditor')).toHaveAttribute(
      'readonly'
    );
    expect(receivedProps[0]).toEqual(
      expect.objectContaining({
        className: TEXT_MODE_INPUT_CLASS,
        inputClassName: TEXT_MODE_INPUT_FIELD_CLASS,
        inputDataTest: 'TextModeEditor',
        readOnly: true,
        spellCheck: false,
      })
    );
  });

  it('scopes Prism tokens and preserves layer, caret, selection, and marker CSS', () => {
    const css = readFileSync(
      join(__dirname, 'text-mode-editor.module.css'),
      'utf8'
    );

    for (const token of [
      'keyword',
      'boolean',
      'operator',
      'punctuation',
      'string',
      'number',
      'function',
      'selector',
      'property',
      'column-name',
    ]) {
      expect(css).toContain(`.editorLayer :global(.token.${token})`);
    }

    expect(css).toContain('color: var(--query-builder-color-info-primary)');
    expect(css).toContain('color: var(--query-builder-color-success-primary)');
    expect(css).toContain('color: var(--query-builder-color-warning-primary)');
    expect(css).toContain('color: var(--query-builder-color-primary-default)');
    expect(css).not.toMatch(/#[0-9a-f]{6}/i);
    expect(css).not.toMatch(/^\s*:global\(\.token/m);
    expect(css).toContain('caret-color: var(--query-builder-color-grey-800)');
    expect(css).toContain('::selection');
    expect(css).toContain('::-moz-selection');
    expect(css).toContain('color: transparent !important');
    expect(css).toContain('-webkit-text-fill-color: transparent');
    expect(css).toMatch(/\.editorLayer,\s+\.diagnosticOverlay/);
    expect(css).toContain('width: 0');
    expect(css).toContain(
      'border-bottom: 2px solid var(--query-builder-color-secondary-dark)'
    );
  });

  it('renders on the server without theme or styled-components attributes', () => {
    const markup = renderToString(
      <TextModeEditor {...baseProps} value="SELECT 1" />
    );

    expect(markup).toContain(TEXT_MODE_INPUT_CLASS);
    expect(markup).toContain(TEXT_MODE_INPUT_FIELD_CLASS);
    expect(markup).toContain(`class="${styles.editorLayer}"`);
    expect(markup).not.toContain('$theme');
    expect(markup).not.toContain('data-styled');
  });
});
