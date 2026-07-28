import React, { FC, useEffect, useRef, useState } from 'react';
import type * as Monaco from 'monaco-editor';
import { ITextModeEditorProps } from '../../../../builder/text-mode/types/text-mode-editor-props';
import { ITextModeProtectedRange } from '../../../../builder/text-mode/types/text-mode-protected-range';
import { createMonacoRangeFromOffsets } from '../../utils/create-monaco-range-from-offsets';
import { createMonacoDiagnosticDecoration } from '../../utils/create-monaco-diagnostic-decoration';
import { doesChangeIntersectProtectedRanges } from '../../utils/does-change-intersect-protected-ranges';
import { restoreSelectionsBeforeChange } from '../../utils/restore-selection-before-change';
import { updateProtectedRangesAfterChange } from '../../utils/update-protected-ranges-after-change';

import styles from './monaco-text-mode-editor.module.css';

const EMPTY_PROTECTED_RANGES: ITextModeProtectedRange[] = [];

const areProtectedRangesEqual = (
  left: ITextModeProtectedRange[],
  right: ITextModeProtectedRange[]
): boolean =>
  left.length === right.length &&
  left.every(
    (range, index) =>
      range.start === right[index]?.start && range.end === right[index]?.end
  );

export const MonacoTextModeEditor: FC<ITextModeEditorProps> = ({
  value,
  diagnostics,
  protectedRanges = EMPTY_PROTECTED_RANGES,
  protectedRangeHoverMessage = null,
  errorMessage,
  readOnly = false,
  allowProtectedRangeDeletion = false,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const changeSubscriptionRef = useRef<Monaco.IDisposable | null>(null);
  const onChangeRef = useRef(onChange);
  const allowProtectedRangeDeletionRef = useRef(allowProtectedRangeDeletion);
  const initialReadOnlyRef = useRef(readOnly);
  const initialValueRef = useRef(value);
  const isSyncingValueRef = useRef(false);
  const isRevertingChangeRef = useRef(false);
  const pendingSelectionRestoreRef = useRef<Monaco.Selection[] | null>(null);
  const pendingSelectionRestoreValueRef = useRef<string | null>(null);
  const pendingEchoValuesRef = useRef<string[]>([]);
  const decorationIdsRef = useRef<string[]>([]);
  const protectedRangesRef = useRef<ITextModeProtectedRange[]>(protectedRanges);
  const acceptedValueRef = useRef(value);
  const acceptedProtectedRangesRef = useRef<ITextModeProtectedRange[]>([
    ...protectedRanges,
  ]);
  const [editorReady, setEditorReady] = useState(false);
  const [renderedProtectedRanges, setRenderedProtectedRanges] =
    useState<ITextModeProtectedRange[]>(protectedRanges);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    allowProtectedRangeDeletionRef.current = allowProtectedRangeDeletion;
  }, [allowProtectedRangeDeletion]);

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
        value: initialValueRef.current,
        language: 'sql',
        theme: 'vs',
        readOnly: initialReadOnlyRef.current,
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
      changeSubscriptionRef.current = editor.onDidChangeModelContent(
        (event) => {
          if (isSyncingValueRef.current || isRevertingChangeRef.current) {
            return;
          }

          const model = editor.getModel();

          if (!model) {
            onChangeRef.current(editor.getValue());
            return;
          }

          const monaco = monacoRef.current;
          const currentSelections = editor.getSelections();
          const restoredSelections =
            monaco && currentSelections && currentSelections.length > 0
              ? restoreSelectionsBeforeChange(
                  currentSelections,
                  event.changes,
                  model,
                  monaco
                )
              : null;

          const intersectsProtectedRange = event.changes.some((change) =>
            doesChangeIntersectProtectedRanges(
              change,
              protectedRangesRef.current,
              {
                allowPureDeletionOfProtectedRanges:
                  allowProtectedRangeDeletionRef.current,
                text: change.text,
              }
            )
          );

          if (intersectsProtectedRange) {
            const restoredProtectedRanges = [
              ...acceptedProtectedRangesRef.current,
            ];

            isRevertingChangeRef.current = true;
            editor.setValue(acceptedValueRef.current);
            if (restoredSelections && restoredSelections.length > 0) {
              editor.setSelections(restoredSelections);
            }
            protectedRangesRef.current = restoredProtectedRanges;
            setRenderedProtectedRanges(restoredProtectedRanges);
            pendingSelectionRestoreRef.current = null;
            pendingSelectionRestoreValueRef.current = null;
            pendingEchoValuesRef.current = [];
            isRevertingChangeRef.current = false;
            return;
          }

          protectedRangesRef.current = event.changes.reduce(
            (ranges, change) =>
              updateProtectedRangesAfterChange(ranges, change),
            protectedRangesRef.current
          );
          setRenderedProtectedRanges(protectedRangesRef.current);
          pendingSelectionRestoreRef.current = restoredSelections;
          pendingSelectionRestoreValueRef.current = model.getValue();
          if (
            pendingEchoValuesRef.current[
              pendingEchoValuesRef.current.length - 1
            ] !== model.getValue()
          ) {
            pendingEchoValuesRef.current = [
              ...pendingEchoValuesRef.current,
              model.getValue(),
            ];
          }

          onChangeRef.current(model.getValue());
        }
      );

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

    if (
      areProtectedRangesEqual(
        acceptedProtectedRangesRef.current,
        nextProtectedRanges
      )
    ) {
      return;
    }

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
    const pendingEchoIndex = pendingEchoValuesRef.current.indexOf(value);

    if (currentValue === value) {
      acceptedValueRef.current = value;
      if (pendingEchoIndex !== -1) {
        pendingEchoValuesRef.current = pendingEchoValuesRef.current.slice(
          pendingEchoIndex + 1
        );
      }

      if (pendingSelectionRestoreValueRef.current !== value) {
        pendingSelectionRestoreRef.current = null;
        pendingSelectionRestoreValueRef.current = null;
      }

      return;
    }

    if (
      pendingEchoValuesRef.current.length > 0 &&
      value === acceptedValueRef.current
    ) {
      return;
    }

    if (pendingEchoIndex !== -1) {
      const hasNewerPendingEcho =
        pendingEchoIndex < pendingEchoValuesRef.current.length - 1;

      pendingEchoValuesRef.current = pendingEchoValuesRef.current.slice(
        pendingEchoIndex + 1
      );

      if (hasNewerPendingEcho) {
        return;
      }
    }

    isSyncingValueRef.current = true;
    editorRef.current.setValue(value);
    protectedRangesRef.current = [...acceptedProtectedRangesRef.current];
    setRenderedProtectedRanges(protectedRangesRef.current);
    if (
      pendingSelectionRestoreRef.current &&
      pendingSelectionRestoreRef.current.length > 0
    ) {
      editorRef.current.setSelections(pendingSelectionRestoreRef.current);
    }
    isSyncingValueRef.current = false;
    acceptedValueRef.current = value;
    pendingSelectionRestoreRef.current = null;
    pendingSelectionRestoreValueRef.current = null;
    pendingEchoValuesRef.current = [];
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
          .filter((range) => range.end > range.start)
          .map((range) => ({
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
        ...diagnostics.map((diagnostic) =>
          createMonacoDiagnosticDecoration(
            monacoRef.current as typeof Monaco,
            model,
            diagnostic
          )
        ),
      ]
    );
  }, [
    diagnostics,
    editorReady,
    protectedRangeHoverMessage,
    renderedProtectedRanges,
    value,
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.frame}>
        <div
          ref={containerRef}
          className={`${styles.surface} rqb-monaco-text-mode-editor`}
          data-test="MonacoTextModeEditor"
        />
      </div>
      {errorMessage ? (
        <div className={styles.errorMessage} data-test="TextModeError">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};
