import { createMonacoDiagnosticDecoration } from './create-monaco-diagnostic-decoration';

describe('createMonacoDiagnosticDecoration', () => {
  const monaco = {
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
  } as never;

  const model = {
    getPositionAt: (offset: number) => ({
      lineNumber: 1,
      column: offset + 1,
    }),
  } as never;

  it('creates an inline highlight for non-empty diagnostics', () => {
    const decoration = createMonacoDiagnosticDecoration(monaco, model, {
      code: 'syntax',
      message: 'Unexpected token.',
      start: 3,
      end: 7,
    });

    expect(decoration.options).toEqual({
      inlineClassName: 'rqb-monaco-text-mode-diagnostic',
    });
  });

  it('creates an injected marker for zero-width diagnostics', () => {
    const decoration = createMonacoDiagnosticDecoration(monaco, model, {
      code: 'syntax',
      message: 'Missing closing parenthesis.',
      start: 12,
      end: 12,
    });

    expect(decoration.options).toEqual({
      inlineClassName: 'rqb-monaco-text-mode-marker-anchor',
    });
  });
});
