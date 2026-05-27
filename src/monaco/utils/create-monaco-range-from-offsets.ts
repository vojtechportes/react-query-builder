import type * as Monaco from 'monaco-editor';

export const createMonacoRangeFromOffsets = (
  monaco: typeof Monaco,
  model: Monaco.editor.ITextModel,
  start: number,
  end: number
): Monaco.Range => {
  const startPosition = model.getPositionAt(start);
  const endPosition = model.getPositionAt(end);

  return new monaco.Range(
    startPosition.lineNumber,
    startPosition.column,
    endPosition.lineNumber,
    endPosition.column
  );
};
