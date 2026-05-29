import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type * as Monaco from 'monaco-editor';
import { ITextModeEditorProps } from '../../builder/text-mode/types/text-mode-editor-props';
import { ITextModeProtectedRange } from '../../builder/text-mode/types/text-mode-protected-range';
import { useTheme } from '../../theme-provider/hooks/use-theme';
import { IThemeProps } from '../../theme-provider/theme-provider';
import { createMonacoRangeFromOffsets } from '../utils/create-monaco-range-from-offsets';
import { createMonacoDiagnosticDecoration } from '../utils/create-monaco-diagnostic-decoration';
import { doesChangeIntersectProtectedRanges } from '../utils/does-change-intersect-protected-ranges';
import { updateProtectedRangesAfterChange } from '../utils/update-protected-ranges-after-change';

const EditorRoot = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const EditorFrame = styled.div<{ $theme: Required<IThemeProps> }>`
  min-height: 10rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  border-radius: 4px;
  background: ${({ $theme }) => $theme.colors.white};
  overflow: hidden;

  .rqb-monaco-text-mode-editor {
    min-height: 10rem;
    height: 100%;
  }

  .rqb-monaco-text-mode-diagnostic {
    background: rgba(244, 67, 54, 0.12);
    box-shadow: inset 0 -2px 0 ${({ $theme }) => $theme.colors.error.primary};
    border-radius: 2px;
  }

  .monaco-editor .view-lines .rqb-monaco-text-mode-protected,
  .monaco-editor .view-lines span.rqb-monaco-text-mode-protected,
  .monaco-editor .view-lines .rqb-monaco-text-mode-protected[class*='mtk'],
  .monaco-editor .view-lines span.rqb-monaco-text-mode-protected[class*='mtk'] {
    color: ${({ $theme }) => $theme.colors.grey['600']} !important;
    background: rgba(245, 245, 245, 0.92) !important;
    box-shadow: inset 0 0 0 1px rgba(189, 189, 189, 0.65);
    border-radius: 3px;
    filter: grayscale(1);
    opacity: 0.62;
    text-shadow: none !important;
  }

  .monaco-editor .view-lines .rqb-monaco-text-mode-protected *,
  .monaco-editor .view-lines span.rqb-monaco-text-mode-protected * {
    color: ${({ $theme }) => $theme.colors.grey['600']} !important;
    text-shadow: none !important;
  }

  .monaco-editor .view-lines .rqb-monaco-text-mode-marker-anchor,
  .monaco-editor .view-lines span.rqb-monaco-text-mode-marker-anchor,
  .monaco-editor .view-lines .rqb-monaco-text-mode-marker-anchor[class*='mtk'],
  .monaco-editor .view-lines span.rqb-monaco-text-mode-marker-anchor[class*='mtk'] {
    box-shadow:
      inset -2px 0 0 ${({ $theme }) => $theme.colors.error.primary},
      inset 0 -2px 0 ${({ $theme }) => $theme.colors.error.primary} !important;
    border-radius: 1px;
  }

  .monaco-editor .view-lines .rqb-monaco-text-mode-protected.rqb-monaco-text-mode-marker-anchor,
  .monaco-editor
    .view-lines
    span.rqb-monaco-text-mode-protected.rqb-monaco-text-mode-marker-anchor,
  .monaco-editor
    .view-lines
    .rqb-monaco-text-mode-protected.rqb-monaco-text-mode-marker-anchor[class*='mtk'],
  .monaco-editor
    .view-lines
    span.rqb-monaco-text-mode-protected.rqb-monaco-text-mode-marker-anchor[class*='mtk'] {
    box-shadow:
      inset -2px 0 0 ${({ $theme }) => $theme.colors.error.primary},
      inset 0 -2px 0 ${({ $theme }) => $theme.colors.error.primary} !important;
    opacity: 1 !important;
    filter: none !important;
  }
`;

const EditorSurface = styled.div`
  min-height: 10rem;
  height: 100%;
`;

const ErrorMessage = styled.div<{ $theme: Required<IThemeProps> }>`
  color: ${({ $theme }) => $theme.colors.error.primary};
  font-size: 0.8rem;
`;

export const MonacoTextModeEditor: FC<ITextModeEditorProps> = ({
  value,
  diagnostics,
  protectedRanges = [],
  protectedRangeHoverMessage = null,
  errorMessage,
  readOnly = false,
  allowProtectedRangeDeletion = false,
  onChange,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const changeSubscriptionRef = useRef<Monaco.IDisposable | null>(null);
  const onChangeRef = useRef(onChange);
  const isSyncingValueRef = useRef(false);
  const isRevertingChangeRef = useRef(false);
  const decorationIdsRef = useRef<string[]>([]);
  const protectedRangesRef = useRef<ITextModeProtectedRange[]>(protectedRanges);
  const acceptedValueRef = useRef(value);
  const acceptedProtectedRangesRef = useRef<ITextModeProtectedRange[]>(
    [...protectedRanges]
  );
  const [editorReady, setEditorReady] = useState(false);
  const [renderedProtectedRanges, setRenderedProtectedRanges] =
    useState<ITextModeProtectedRange[]>(protectedRanges);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isDisposed = false;

    const mountEditor = async () => {
      if (!containerRef.current) {
        return;
      }

      const monaco = await import('monaco-editor');

      if (isDisposed || !containerRef.current) {
        return;
      }

      monacoRef.current = monaco;
      const editor = monaco.editor.create(containerRef.current, {
        value,
        language: 'sql',
        theme: 'vs',
        readOnly,
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        minimap: { enabled: false },
        overviewRulerLanes: 0,
        scrollBeyondLastLine: false,
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        lineHeight: 21,
        padding: {
          top: 12,
          bottom: 12,
        },
      });

      editorRef.current = editor;
      changeSubscriptionRef.current = editor.onDidChangeModelContent(event => {
        if (isSyncingValueRef.current || isRevertingChangeRef.current) {
          return;
        }

        const model = editor.getModel();

        if (!model) {
          onChangeRef.current(editor.getValue());
          return;
        }

        const intersectsProtectedRange = event.changes.some(change =>
          doesChangeIntersectProtectedRanges(change, protectedRangesRef.current, {
            allowPureDeletionOfProtectedRanges: allowProtectedRangeDeletion,
            text: change.text,
          })
        );

        if (intersectsProtectedRange) {
          const restoredProtectedRanges = [
            ...acceptedProtectedRangesRef.current,
          ];

          isRevertingChangeRef.current = true;
          editor.setValue(acceptedValueRef.current);
          protectedRangesRef.current = restoredProtectedRanges;
          setRenderedProtectedRanges(restoredProtectedRanges);
          isRevertingChangeRef.current = false;
          return;
        }

        protectedRangesRef.current = event.changes.reduce(
          (ranges, change) => updateProtectedRangesAfterChange(ranges, change),
          protectedRangesRef.current
        );
        setRenderedProtectedRanges(protectedRangesRef.current);

        onChangeRef.current(model.getValue());
      });

      setEditorReady(true);
    };

    void mountEditor();

    return () => {
      isDisposed = true;
      changeSubscriptionRef.current?.dispose();
      changeSubscriptionRef.current = null;
      editorRef.current?.dispose();
      editorRef.current = null;
      monacoRef.current = null;
      decorationIdsRef.current = [];
      setEditorReady(false);
    };
  }, []);

  useEffect(() => {
    const nextProtectedRanges = [...protectedRanges];

    protectedRangesRef.current = nextProtectedRanges;
    acceptedProtectedRangesRef.current = nextProtectedRanges;
    setRenderedProtectedRanges(nextProtectedRanges);
  }, [protectedRanges]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.updateOptions({ readOnly });
  }, [readOnly]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const currentValue = editorRef.current.getValue();

    if (currentValue === value) {
      acceptedValueRef.current = value;
      return;
    }

    isSyncingValueRef.current = true;
    editorRef.current.setValue(value);
    isSyncingValueRef.current = false;
    acceptedValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!editorReady || !editorRef.current || !monacoRef.current) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      [
        ...renderedProtectedRanges
          .filter(range => range.end > range.start)
          .map(range => ({
            range: createMonacoRangeFromOffsets(
              monacoRef.current as typeof Monaco,
              model,
              range.start,
              range.end
            ),
            options: {
              inlineClassName: 'rqb-monaco-text-mode-protected',
              inlineClassNameAffectsLetterSpacing: true,
              hoverMessage: protectedRangeHoverMessage
                ? {
                    value: protectedRangeHoverMessage,
                  }
                : undefined,
              zIndex: 10,
            },
          })),
        ...diagnostics.map(diagnostic =>
          createMonacoDiagnosticDecoration(
            monacoRef.current as typeof Monaco,
            model,
            diagnostic
          )
        ),
      ]
    );
  }, [diagnostics, editorReady, protectedRangeHoverMessage, renderedProtectedRanges, value]);

  return (
    <EditorRoot>
      <EditorFrame $theme={theme}>
        <EditorSurface
          ref={containerRef}
          className="rqb-monaco-text-mode-editor"
          data-test="MonacoTextModeEditor"
        />
      </EditorFrame>
      {errorMessage ? (
        <ErrorMessage $theme={theme} data-test="TextModeError">
          {errorMessage}
        </ErrorMessage>
      ) : null}
    </EditorRoot>
  );
};
