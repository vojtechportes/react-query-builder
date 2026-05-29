import { updateProtectedRangesAfterChange } from './update-protected-ranges-after-change';

describe('updateProtectedRangesAfterChange', () => {
  it('shifts protected ranges after edits before them', () => {
    expect(
      updateProtectedRangesAfterChange(
        [{ start: 10, end: 15 }],
        {
          rangeOffset: 2,
          rangeLength: 3,
          text: 'abcdef',
        }
      )
    ).toEqual([{ start: 13, end: 18 }]);
  });

  it('keeps protected ranges unchanged after edits that happen after them', () => {
    expect(
      updateProtectedRangesAfterChange(
        [{ start: 10, end: 15 }],
        {
          rangeOffset: 20,
          rangeLength: 2,
          text: 'x',
        }
      )
    ).toEqual([{ start: 10, end: 15 }]);
  });
});
