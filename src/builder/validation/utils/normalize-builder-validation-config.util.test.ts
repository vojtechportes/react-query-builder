import { normalizeBuilderValidationConfig } from './normalize-builder-validation-config.util';

type ValidationRule = { min?: number; max?: number };

describe('normalizeBuilderValidationConfig', () => {
  it('handles undefined, shorthand, and structured validation', () => {
    const structured = {
      common: { min: 1 },
      rules: [{ operators: ['EQUAL' as const], max: 5 }],
    };

    expect(normalizeBuilderValidationConfig<ValidationRule>(undefined)).toBe(
      undefined
    );
    expect(
      normalizeBuilderValidationConfig<ValidationRule>({ min: 1 })
    ).toEqual({ common: { min: 1 } });
    expect(normalizeBuilderValidationConfig<ValidationRule>(structured)).toBe(
      structured
    );
  });
});
