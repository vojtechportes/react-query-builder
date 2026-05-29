import React from 'react';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import { MonacoTextModeEditor } from './monaco-text-mode-editor';

type IMonacoChange = {
  rangeOffset: number;
  rangeLength: number;
  text: string;
};

type IMonacoDecoration = {
  options?: {
    inlineClassName?: string;
  };
};

jest.mock('monaco-editor', () => {
  let currentValue = '';
  let changeListener:
    | ((event: { changes: IMonacoChange[] }) => void)
    | null = null;
  let lastDecorations: IMonacoDecoration[] = [];

  const model = {
    getPositionAt: (offset: number) => ({
      lineNumber: 1,
      column: offset + 1,
    }),
    getValue: () => currentValue,
  };

  const editorInstance = {
    getValue: () => currentValue,
    setValue: (nextValue: string) => {
      currentValue = nextValue;
    },
    getModel: () => model,
    onDidChangeModelContent: (
      listener: (event: { changes: IMonacoChange[] }) => void
    ) => {
      changeListener = listener;

      return {
        dispose: () => {
          changeListener = null;
        },
      };
    },
    updateOptions: jest.fn(),
    deltaDecorations: jest.fn(
      (_previousDecorations: string[], nextDecorations: IMonacoDecoration[]) => {
        lastDecorations = nextDecorations;
        return nextDecorations.map((_, index) => `decoration-${index}`);
      }
    ),
    dispose: jest.fn(),
  };

  const create = jest.fn((_container: HTMLElement, options: { value: string }) => {
    currentValue = options.value;
    return editorInstance;
  });

  return {
    __esModule: true,
    editor: {
      create,
    },
    Range: class {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;

      constructor(
        startLineNumber: number,
        startColumn: number,
        endLineNumber: number,
        endColumn: number
      ) {
        this.startLineNumber = startLineNumber;
        this.startColumn = startColumn;
        this.endLineNumber = endLineNumber;
        this.endColumn = endColumn;
      }
    },
    __mock: {
      getCurrentValue: () => currentValue,
      getLastDecorations: () => lastDecorations,
      emitChange: (nextValue: string, changes: IMonacoChange[]) => {
        currentValue = nextValue;
        changeListener?.({ changes });
      },
      reset: () => {
        currentValue = '';
        changeListener = null;
        lastDecorations = [];
        create.mockClear();
        editorInstance.updateOptions.mockClear();
        editorInstance.deltaDecorations.mockClear();
        editorInstance.dispose.mockClear();
      },
    },
  };
}, { virtual: true });

const getMonacoMock = () =>
  (jest.requireMock('monaco-editor') as {
    __mock: {
      getCurrentValue: () => string;
      getLastDecorations: () => IMonacoDecoration[];
      emitChange: (nextValue: string, changes: IMonacoChange[]) => void;
      reset: () => void;
    };
    editor: {
      create: jest.Mock;
    };
  }).__mock;

describe('MonacoTextModeEditor', () => {
  beforeEach(() => {
    getMonacoMock().reset();
  });

  it('restores the last accepted value and keeps protected decorations after a blocked delete', async () => {
    const onChange = jest.fn();
    const monacoMock = getMonacoMock();
    const initialValue = "(FIELD = 'alpha' OR NUMBER <> 5)";

    render(
      <MonacoTextModeEditor
        value={initialValue}
        diagnostics={[]}
        errorMessage={null}
        protectedRanges={[
          { start: 0, end: 1 },
          { start: 1, end: 6 },
          { start: 7, end: 8 },
          { start: 31, end: 32 },
        ]}
        onChange={onChange}
      />
    );

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
      expect(
        monacoMock
          .getLastDecorations()
          .filter(
            (decoration) =>
              decoration.options?.inlineClassName ===
              'rqb-monaco-text-mode-protected'
          )
      ).toHaveLength(4);
    });

    act(() => {
      monacoMock.emitChange("(FIELD = 'alpha')", [
        {
          rangeOffset: 0,
          rangeLength: initialValue.length,
          text: "(FIELD = 'alpha')",
        },
      ]);
    });

    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
      expect(
        monacoMock
          .getLastDecorations()
          .filter(
            (decoration) =>
              decoration.options?.inlineClassName ===
              'rqb-monaco-text-mode-protected'
          )
      ).toHaveLength(4);
    });
  });

  it('emits valid unlocked edits and updates protected decorations from the shifted ranges', async () => {
    const onChange = jest.fn();
    const monacoMock = getMonacoMock();
    const initialValue = "FIELD = 'alpha' AND NUMBER <> 5";

    render(
      <MonacoTextModeEditor
        value={initialValue}
        diagnostics={[]}
        errorMessage={null}
        protectedRanges={[
          { start: 0, end: 5 },
          { start: 6, end: 7 },
        ]}
        onChange={onChange}
      />
    );

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
    });

    act(() => {
      monacoMock.emitChange("FIELD = 'alpha' AND TOTAL NUMBER <> 5", [
        {
          rangeOffset: 20,
          rangeLength: 0,
          text: 'TOTAL ',
        },
      ]);
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        "FIELD = 'alpha' AND TOTAL NUMBER <> 5"
      );
      expect(monacoMock.getCurrentValue()).toBe(
        "FIELD = 'alpha' AND TOTAL NUMBER <> 5"
      );
      expect(
        monacoMock
          .getLastDecorations()
          .filter(
            (decoration) =>
              decoration.options?.inlineClassName ===
              'rqb-monaco-text-mode-protected'
          )
      ).toHaveLength(2);
    });
  });
});
