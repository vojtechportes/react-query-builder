import { ITextModeProtectedRange } from '../../builder/text-mode/types/text-mode-protected-range';
import { ITextModelChange } from './does-change-intersect-protected-ranges';

export const updateProtectedRangesAfterChange = (
  protectedRanges: ITextModeProtectedRange[],
  change: ITextModelChange & { text: string }
): ITextModeProtectedRange[] => {
  const delta = change.text.length - change.rangeLength;
  const changeEnd = change.rangeOffset + change.rangeLength;

  return protectedRanges.map(range => {
    if (changeEnd <= range.start) {
      return {
        start: range.start + delta,
        end: range.end + delta,
      };
    }

    if (change.rangeOffset >= range.end) {
      return range;
    }

    return range;
  });
};
