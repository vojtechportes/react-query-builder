import {
  BuilderFieldOperator,
  IBuilderValidationConfig,
} from '../../builder';
import { mergeBuilderValidationRule } from './merge-builder-validation-rule.util';
import { normalizeBuilderValidationConfig } from './normalize-builder-validation-config.util';

export const resolveBuilderValidationRule = <TRule>(
  validation: Partial<TRule> | IBuilderValidationConfig<TRule> | undefined,
  operator: BuilderFieldOperator | undefined
): Partial<TRule> | undefined => {
  const normalizedValidation = normalizeBuilderValidationConfig(validation);

  if (!normalizedValidation) {
    return undefined;
  }

  return (normalizedValidation.rules || []).reduce<Partial<TRule>>(
    (resolvedValidation, validationRule) => {
      if (!operator || !validationRule.operators.includes(operator)) {
        return resolvedValidation;
      }

      return mergeBuilderValidationRule(
        resolvedValidation,
        validationRule as Partial<TRule>
      );
    },
    normalizedValidation.common || {}
  );
};
