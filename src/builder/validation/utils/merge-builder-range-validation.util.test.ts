import { mergeBuilderRangeValidation } from './merge-builder-range-validation.util';

describe('mergeBuilderRangeValidation', () => {
  it('returns undefined when both range configurations are absent', () => {
    expect(mergeBuilderRangeValidation(undefined, undefined)).toBeUndefined();
  });

  it('merges range settings at each nested boundary', () => {
    expect(
      mergeBuilderRangeValidation<{ min?: number; max?: number }, number>(
        {
          common: { min: 1, max: 10 },
          start: { max: 8 },
          requireAscending: true,
        },
        {
          common: { max: 20 },
          start: { min: 2 },
          end: { min: 4 },
        }
      )
    ).toEqual({
      common: { min: 1, max: 20 },
      start: { max: 8, min: 2 },
      end: { min: 4 },
      requireAscending: true,
    });
  });
});
