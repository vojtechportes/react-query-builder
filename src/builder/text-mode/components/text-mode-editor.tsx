import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../../theme-provider/theme-provider';
import { useTheme } from '../../../theme-provider/hooks/use-theme';
import { TEXT_MODE_INPUT_CLASS } from '../constants/text-mode-input-class';
import { TEXT_MODE_INPUT_FIELD_CLASS } from '../constants/text-mode-input-field-class';
import { TextModeInput } from './text-mode-input';
import { ITextModeEditorProps } from '../types/text-mode-editor-props';
import { ITextModeInputProps } from '../types/text-mode-input-props';
import { getSqlHighlightedHtml } from '../utils/get-sql-highlighted-html';

const EditorRoot = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const EditorFrame = styled.div<{ $theme: Required<IThemeProps> }>`
  position: relative;
  min-height: 10rem;

  .${TEXT_MODE_INPUT_CLASS} {
    position: relative;
    min-height: 10rem;
  }

  .${TEXT_MODE_INPUT_FIELD_CLASS} {
    position: relative;
    z-index: 2;
    width: 100%;
    min-height: 10rem;
    margin: 0;
    padding: 0.75rem;
    color: transparent !important;
    -webkit-text-fill-color: transparent;
    caret-color: ${({ $theme }) => $theme.colors.grey['800']};
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    resize: vertical;
    background: transparent !important;

    &::selection {
      color: transparent;
      -webkit-text-fill-color: transparent;
      background: rgba(37, 99, 235, 0.22);
    }

    &::-moz-selection {
      color: transparent;
      background: rgba(37, 99, 235, 0.22);
    }
  }
`;

const EditorLayer = styled.pre<{ $theme: Required<IThemeProps> }>`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  margin: 0;
  padding: 0.75rem;
  overflow: hidden;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  .token.keyword,
  .token.boolean {
    color: #1d4ed8;
    font-weight: 700;
  }

  .token.operator,
  .token.punctuation {
    color: #374151;
  }

  .token.operator {
    font-weight: 600;
  }

  .token.string {
    color: #047857;
  }

  .token.number {
    color: #c2410c;
  }

  .token.function {
    color: #7c3aed;
    font-weight: 600;
  }

  .token.selector,
  .token.property,
  .token.column-name {
    color: ${({ $theme }) => $theme.colors.grey['900']};
    font-weight: 600;
  }
`;

const DiagnosticOverlay = styled.pre`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  margin: 0;
  padding: 0.75rem;
  overflow: hidden;
  color: transparent;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const DiagnosticText = styled.span<{ $theme: Required<IThemeProps> }>`
  border-radius: 2px;
  background: rgba(244, 67, 54, 0.12);
  box-shadow: inset 0 -2px 0 ${({ $theme }) => $theme.colors.secondary.dark};
`;

const MissingTokenMarker = styled.span<{ $theme: Required<IThemeProps> }>`
  position: relative;
  display: inline-block;
  width: 0;
  height: 1em;
  vertical-align: text-bottom;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0.15em;
    width: 0.55rem;
    border-bottom: 2px solid ${({ $theme }) => $theme.colors.secondary.dark};
    border-radius: 999px;
  }
`;

const ErrorMessage = styled.div<{ $theme: Required<IThemeProps> }>`
  color: ${({ $theme }) => $theme.colors.secondary.dark};
  font-size: 0.8rem;
`;

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
  const theme = useTheme();
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
        <DiagnosticText
          key={`diagnostic-${index}`}
          $theme={theme}
          data-test={`TextModeDiagnostic[${index}]`}
        >
          {value.slice(start, end)}
        </DiagnosticText>
      );
    } else {
      diagnosticContent.push(
        <MissingTokenMarker
          key={`diagnostic-${index}`}
          $theme={theme}
          data-test={`TextModeDiagnosticMarker[${index}]`}
        >
          {'\u200b'}
        </MissingTokenMarker>
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
    <EditorRoot>
      <EditorFrame $theme={theme}>
        <TextModeInputComponent
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          spellCheck={false}
          className={TEXT_MODE_INPUT_CLASS}
          inputClassName={TEXT_MODE_INPUT_FIELD_CLASS}
          inputDataTest="TextModeEditor"
        />
        <EditorLayer
          $theme={theme}
          aria-hidden="true"
          data-test="TextModeSyntaxLayer"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
        <DiagnosticOverlay aria-hidden="true">
          {diagnosticContent}
        </DiagnosticOverlay>
      </EditorFrame>
      {errorMessage ? (
        <ErrorMessage $theme={theme} data-test="TextModeError">
          {errorMessage}
        </ErrorMessage>
      ) : null}
    </EditorRoot>
  );
};
