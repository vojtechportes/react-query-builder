import type * as Monaco from 'monaco-editor';

interface ITextModelChangeLike {
  rangeOffset: number;
  rangeLength: number;
  text: string;
}

interface IResolvedChange extends ITextModelChangeLike {
  postStart: number;
  postEnd: number;
}

const resolveChanges = (
  changes: ITextModelChangeLike[]
): IResolvedChange[] => {
  const sortedChanges = [...changes].sort(
    (left, right) => left.rangeOffset - right.rangeOffset
  );
  let delta = 0;

  return sortedChanges.map((change) => {
    const postStart = change.rangeOffset + delta;
    const postEnd = postStart + change.text.length;

    delta += change.text.length - change.rangeLength;

    return {
      ...change,
      postStart,
      postEnd,
    };
  });
};

const restoreOffsetBeforeChange = (
  offset: number,
  changes: IResolvedChange[]
): number =>
  [...changes].reverse().reduce((restoredOffset, change) => {
    if (restoredOffset < change.postStart) {
      return restoredOffset;
    }

    if (restoredOffset <= change.postEnd) {
      return change.rangeOffset;
    }

    return restoredOffset + change.rangeLength - change.text.length;
  }, offset);

export const restoreSelectionsBeforeChange = (
  selections: Monaco.Selection[],
  changes: ITextModelChangeLike[],
  model: Monaco.editor.ITextModel,
  monaco: typeof Monaco
): Monaco.Selection[] => {
  const resolvedChanges = resolveChanges(changes);

  return selections.map((selection) => {
    const selectionStart = model.getOffsetAt(selection.getStartPosition());
    const selectionEnd = model.getOffsetAt(selection.getEndPosition());
    const restoredStart = restoreOffsetBeforeChange(selectionStart, resolvedChanges);
    const restoredEnd = restoreOffsetBeforeChange(selectionEnd, resolvedChanges);
    const restoredStartPosition = model.getPositionAt(restoredStart);
    const restoredEndPosition = model.getPositionAt(restoredEnd);

    return new monaco.Selection(
      restoredStartPosition.lineNumber,
      restoredStartPosition.column,
      restoredEndPosition.lineNumber,
      restoredEndPosition.column
    );
  });
};
