import { doesChangeIntersectProtectedRanges } from './does-change-intersect-protected-ranges';

describe('doesChangeIntersectProtectedRanges', () => {
  const protectedRanges = [
    { start: 4, end: 5 },
    { start: 5, end: 15 },
    { start: 16, end: 17 },
  ];

  it('detects deletes that span protected bracket and inner protected content', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 4,
          rangeLength: 13,
        },
        protectedRanges
      )
    ).toBe(true);
  });

  it('detects inserts inside a protected range', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 10,
          rangeLength: 0,
        },
        protectedRanges
      )
    ).toBe(true);
  });

  it('allows inserts at the exact boundary of a protected range', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 5,
          rangeLength: 0,
        },
        protectedRanges
      )
    ).toBe(false);
  });

  it('ignores edits entirely outside protected ranges', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 20,
          rangeLength: 2,
        },
        protectedRanges
      )
    ).toBe(false);
  });

  it('allows pure deletions that fully cover protected ranges when delete protection is disabled', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 4,
          rangeLength: 13,
        },
        protectedRanges,
        {
          allowPureDeletionOfProtectedRanges: true,
          text: '',
        }
      )
    ).toBe(false);
  });

  it('still blocks replacements over protected ranges when delete protection is disabled', () => {
    expect(
      doesChangeIntersectProtectedRanges(
        {
          rangeOffset: 4,
          rangeLength: 13,
        },
        protectedRanges,
        {
          allowPureDeletionOfProtectedRanges: true,
          text: 'replacement',
        }
      )
    ).toBe(true);
  });
});
