import { ITextModeProtectedRange } from '../../builder/text-mode/types/text-mode-protected-range';

export interface ITextModelChange {
  rangeOffset: number;
  rangeLength: number;
}

export const doesChangeIntersectProtectedRanges = (
  change: ITextModelChange,
  protectedRanges: ITextModeProtectedRange[],
  options: {
    allowPureDeletionOfProtectedRanges?: boolean;
    text?: string;
  } = {}
): boolean => {
  const changeStart = change.rangeOffset;
  const changeEnd = change.rangeOffset + change.rangeLength;

  if (change.rangeLength === 0) {
    return protectedRanges.some(
      range => changeStart > range.start && changeStart < range.end
    );
  }

  if (
    options.allowPureDeletionOfProtectedRanges &&
    options.text === '' &&
    protectedRanges.some(range => changeStart < range.end && changeEnd > range.start)
  ) {
    return protectedRanges.some(
      range =>
        changeStart < range.end &&
        changeEnd > range.start &&
        !(changeStart <= range.start && changeEnd >= range.end)
    );
  }

  return protectedRanges.some(
    range => changeStart < range.end && changeEnd > range.start
  );
};
