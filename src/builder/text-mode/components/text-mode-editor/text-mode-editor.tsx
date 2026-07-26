import React, { FC } from 'react';
import { TEXT_MODE_INPUT_CLASS } from '../../constants/text-mode-input-class';
import { TEXT_MODE_INPUT_FIELD_CLASS } from '../../constants/text-mode-input-field-class';
import { ITextModeEditorProps } from '../../types/text-mode-editor-props';
import { ITextModeInputProps } from '../../types/text-mode-input-props';
import { getSqlHighlightedHtml } from '../../utils/get-sql-highlighted-html';
import styles from './text-mode-editor.module.css';
import { TextModeInput } from '../text-mode-input';

export interface IDefaultTextModeEditorProps extends ITextModeEditorProps {
  TextModeInputComponent?: React.ComponentType<ITextModeInputProps>;
}

export const TextModeEditor: FC<IDefaultTextModeEditorProps> = ({
  value,
  diagnostics,
  errorMessage,
  TextModeInputComponent = TextModeInput,
  readOnly = false,
  onChange,
}) => {
  const highlightedHtml = value.length > 0 ? getSqlHighlightedHtml(value) : ' ';

  let cursor = 0;
  const diagnosticContent: React.ReactNode[] = [];
  const sortedDiagnostics = [...diagnostics].sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }

    return left.end - right.end;
  });

  sortedDiagnostics.forEach((diagnostic, index) => {
    const start = Math.max(cursor, Math.max(0, diagnostic.start));
    const end = Math.max(start, Math.min(value.length, diagnostic.end));

    if (start > cursor) {
      diagnosticContent.push(value.slice(cursor, start));
    }

    if (end > start) {
      diagnosticContent.push(
        <span
          className={styles.diagnosticText}
          key={`diagnostic-${index}`}
          data-test={`TextModeDiagnostic[${index}]`}
        >
          {value.slice(start, end)}
        </span>
      );
    } else {
      diagnosticContent.push(
        <span
          className={styles.missingTokenMarker}
          key={`diagnostic-${index}`}
          data-test={`TextModeDiagnosticMarker[${index}]`}
        >
          {'\u200b'}
        </span>
      );
    }

    cursor = end;
  });

  if (cursor < value.length) {
    diagnosticContent.push(value.slice(cursor));
  }

  if (diagnosticContent.length === 0) {
    diagnosticContent.push(value.length === 0 ? ' ' : value);
  }

  return (
    <div className={styles.root}>
      <div className={styles.frame}>
        <TextModeInputComponent
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          spellCheck={false}
          className={TEXT_MODE_INPUT_CLASS}
          inputClassName={TEXT_MODE_INPUT_FIELD_CLASS}
          inputDataTest="TextModeEditor"
        />
        <pre
          className={styles.editorLayer}
          aria-hidden="true"
          data-test="TextModeSyntaxLayer"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
        <pre className={styles.diagnosticOverlay} aria-hidden="true">
          {diagnosticContent}
        </pre>
      </div>
      {errorMessage ? (
        <div className={styles.errorMessage} data-test="TextModeError">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};
