import { resolveRangeBoundValidation } from './resolve-range-bound-validation.util';

type ValidationRule = {
  min?: number;
  max?: number;
  range?: {
    common?: { min?: number; max?: number };
    start?: { min?: number; max?: number };
    end?: { min?: number; max?: number };
  };
};

describe('resolveRangeBoundValidation', () => {
  it('applies common and boundary settings over scalar validation', () => {
    const validation: ValidationRule = {
      min: 1,
      max: 100,
      range: {
        common: { min: 2, max: 90 },
        start: { max: 40 },
        end: { min: 50 },
      },
    };

    expect(resolveRangeBoundValidation(validation, 'start')).toEqual({
      min: 2,
      max: 40,
    });
    expect(resolveRangeBoundValidation(validation, 'end')).toEqual({
      min: 50,
      max: 90,
    });
  });
});
