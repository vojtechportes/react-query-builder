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

type ISelectionPosition = {
  lineNumber: number;
  column: number;
};

jest.mock('monaco-editor', () => {
  let currentValue = '';
  let changeListener:
    | ((event: { changes: IMonacoChange[] }) => void)
    | null = null;
  let lastDecorations: IMonacoDecoration[] = [];
  let currentSelections = [
    {
      getStartPosition: () => ({ lineNumber: 1, column: 1 }),
      getEndPosition: () => ({ lineNumber: 1, column: 1 }),
    },
  ];

  const model = {
    getPositionAt: (offset: number) => ({
      lineNumber: 1,
      column: offset + 1,
    }),
    getOffsetAt: (position: ISelectionPosition) => position.column - 1,
    getValue: () => currentValue,
  };

  const editorInstance = {
    getValue: () => currentValue,
    setValue: (nextValue: string) => {
      currentValue = nextValue;
    },
    getModel: () => model,
    getSelections: () => currentSelections,
    setSelections: jest.fn((nextSelections: typeof currentSelections) => {
      currentSelections = nextSelections;
    }),
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
    Selection: class {
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

      getStartPosition() {
        return {
          lineNumber: this.startLineNumber,
          column: this.startColumn,
        };
      }

      getEndPosition() {
        return {
          lineNumber: this.endLineNumber,
          column: this.endColumn,
        };
      }
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
      getSelections: () => currentSelections,
      emitChange: (nextValue: string, changes: IMonacoChange[]) => {
        currentValue = nextValue;
        const lastChange = changes[changes.length - 1];

        if (lastChange) {
          const nextColumn =
            lastChange.rangeOffset + lastChange.text.length + 1;

          currentSelections = [
            {
              getStartPosition: () => ({ lineNumber: 1, column: nextColumn }),
              getEndPosition: () => ({ lineNumber: 1, column: nextColumn }),
            },
          ];
        }

        changeListener?.({ changes });
      },
      setSelections: (nextSelections: typeof currentSelections) => {
        currentSelections = nextSelections;
      },
      reset: () => {
        currentValue = '';
        changeListener = null;
        lastDecorations = [];
        currentSelections = [
          {
            getStartPosition: () => ({ lineNumber: 1, column: 1 }),
            getEndPosition: () => ({ lineNumber: 1, column: 1 }),
          },
        ];
        create.mockClear();
        editorInstance.updateOptions.mockClear();
        editorInstance.deltaDecorations.mockClear();
        editorInstance.setSelections.mockClear();
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
      getSelections: () => Array<{
        getStartPosition: () => ISelectionPosition;
        getEndPosition: () => ISelectionPosition;
      }>;
      emitChange: (nextValue: string, changes: IMonacoChange[]) => void;
      setSelections: (
        nextSelections: Array<{
          getStartPosition: () => ISelectionPosition;
          getEndPosition: () => ISelectionPosition;
        }>
      ) => void;
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

  afterEach(() => {
    jest.useRealTimers();
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

  it('restores the pre-change selection after a blocked edit', async () => {
    const monacoMock = getMonacoMock();
    const initialValue = "A AND (FIELD = 'alpha')";
    const onChange = jest.fn();

    render(
      <MonacoTextModeEditor
        value={initialValue}
        diagnostics={[]}
        errorMessage={null}
        protectedRanges={[{ start: 6, end: initialValue.length }]}
        onChange={onChange}
      />
    );

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
    });

    monacoMock.setSelections([
      {
        getStartPosition: () => ({ lineNumber: 1, column: 8 }),
        getEndPosition: () => ({ lineNumber: 1, column: 8 }),
      },
    ]);

    act(() => {
      monacoMock.emitChange("A AND (XFIELD = 'alpha')", [
        {
          rangeOffset: 7,
          rangeLength: 0,
          text: 'X',
        },
      ]);
    });

    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
      expect(monacoMock.getSelections()[0].getStartPosition()).toEqual({
        lineNumber: 1,
        column: 8,
      });
    });
  });

  it('restores the pre-change selection after a parent-driven revert', async () => {
    const monacoMock = getMonacoMock();
    const initialValue = "A AND (FIELD = 'alpha')";

    const ControlledEditor = () => {
      const [value, setValue] = React.useState(initialValue);

      return (
        <MonacoTextModeEditor
          value={value}
          diagnostics={[]}
          errorMessage={null}
          protectedRanges={[{ start: 6, end: initialValue.length }]}
          onChange={(nextValue) => {
            setValue(nextValue);

            setTimeout(() => {
              setValue(initialValue);
            }, 0);
          }}
        />
      );
    };

    render(<ControlledEditor />);

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
    });

    monacoMock.setSelections([
      {
        getStartPosition: () => ({ lineNumber: 1, column: 6 }),
        getEndPosition: () => ({ lineNumber: 1, column: 6 }),
      },
    ]);

    act(() => {
      monacoMock.emitChange("AX AND (FIELD = 'alpha')", [
        {
          rangeOffset: 5,
          rangeLength: 0,
          text: 'X',
        },
      ]);
    });

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
      expect(monacoMock.getSelections()[0].getStartPosition()).toEqual({
        lineNumber: 1,
        column: 6,
      });
    });
  });

  it('ignores stale controlled value echoes while newer local typing is present', async () => {
    const monacoMock = getMonacoMock();
    const initialValue = "A AND (FIELD = 'alpha')";
    const firstLocalValue = "A AND  (FIELD = 'alpha')";
    const secondLocalValue = "A AND X (FIELD = 'alpha')";
    const onChange = jest.fn();

    const { rerender } = render(
      <MonacoTextModeEditor
        value={initialValue}
        diagnostics={[]}
        errorMessage={null}
        onChange={onChange}
      />
    );

    await waitFor(() => {
      expect(monacoMock.getCurrentValue()).toBe(initialValue);
    });

    act(() => {
      monacoMock.emitChange(firstLocalValue, [
        {
          rangeOffset: 5,
          rangeLength: 0,
          text: ' ',
        },
      ]);
      monacoMock.emitChange(secondLocalValue, [
        {
          rangeOffset: 6,
          rangeLength: 0,
          text: 'X',
        },
      ]);
    });

    expect(monacoMock.getCurrentValue()).toBe(secondLocalValue);
    expect(onChange).toHaveBeenNthCalledWith(1, firstLocalValue);
    expect(onChange).toHaveBeenNthCalledWith(2, secondLocalValue);

    rerender(
      <MonacoTextModeEditor
        value={initialValue}
        diagnostics={[]}
        errorMessage={null}
        onChange={onChange}
      />
    );

    expect(monacoMock.getCurrentValue()).toBe(secondLocalValue);

    rerender(
      <MonacoTextModeEditor
        value={firstLocalValue}
        diagnostics={[]}
        errorMessage={null}
        onChange={onChange}
      />
    );

    expect(monacoMock.getCurrentValue()).toBe(secondLocalValue);

    rerender(
      <MonacoTextModeEditor
        value={secondLocalValue}
        diagnostics={[]}
        errorMessage={null}
        onChange={onChange}
      />
    );

    expect(monacoMock.getCurrentValue()).toBe(secondLocalValue);
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
