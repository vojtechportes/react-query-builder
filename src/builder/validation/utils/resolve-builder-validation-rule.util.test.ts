import { resolveBuilderValidationRule } from './resolve-builder-validation-rule.util';

type ValidationRule = { min?: number; max?: number; integer?: boolean };

describe('resolveBuilderValidationRule', () => {
  it('combines common validation with matching operator rules in order', () => {
    const validation = {
      common: { min: 1, max: 100 },
      rules: [
        { operators: ['EQUAL' as const], max: 20 },
        { operators: ['EQUAL' as const, 'LARGER' as const], min: 5 },
        { operators: ['SMALLER' as const], integer: true },
      ],
    };

    expect(resolveBuilderValidationRule(validation, 'EQUAL')).toEqual({
      min: 5,
      max: 20,
      operators: ['EQUAL', 'LARGER'],
    });
    expect(resolveBuilderValidationRule(validation, undefined)).toEqual({
      min: 1,
      max: 100,
    });
    expect(
      resolveBuilderValidationRule<ValidationRule>(undefined, 'EQUAL')
    ).toBeUndefined();
  });
});
