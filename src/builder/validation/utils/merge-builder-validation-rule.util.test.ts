import { mergeBuilderValidationRule } from './merge-builder-validation-rule.util';

type ValidationRule = {
  min?: number;
  max?: number;
  range?: {
    common?: { min?: number; max?: number };
    start?: { min?: number; max?: number };
    end?: { min?: number; max?: number };
  };
};

describe('mergeBuilderValidationRule', () => {
  it('merges scalar and nested range overrides', () => {
    expect(
      mergeBuilderValidationRule<ValidationRule>(
        {
          min: 1,
          max: 10,
          range: { common: { min: 2 }, start: { max: 8 } },
        },
        {
          max: 20,
          range: { common: { max: 18 }, end: { min: 4 } },
        }
      )
    ).toEqual({
      min: 1,
      max: 20,
      range: {
        common: { min: 2, max: 18 },
        start: { max: 8 },
        end: { min: 4 },
      },
    });
  });
});
