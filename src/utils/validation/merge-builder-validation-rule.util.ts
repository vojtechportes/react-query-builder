import { IBuilderRangeValidation } from '../../builder';
import { mergeBuilderRangeValidation } from './merge-builder-range-validation.util';

export const mergeBuilderValidationRule = <
  TRule,
  TValueValidation = unknown,
  TRangeValue = string | number
>(
  baseRule: Partial<TRule> | undefined,
  overrideRule: Partial<TRule> | undefined
): Partial<TRule> => {
  const baseRangeValidation = (baseRule as { range?: IBuilderRangeValidation<
    TValueValidation,
    TRangeValue
  > } | undefined)?.range;
  const overrideRangeValidation = (overrideRule as { range?: IBuilderRangeValidation<
    TValueValidation,
    TRangeValue
  > } | undefined)?.range;
  const mergedRange = mergeBuilderRangeValidation(
    baseRangeValidation,
    overrideRangeValidation
  );

  return {
    ...baseRule,
    ...overrideRule,
    ...(mergedRange ? { range: mergedRange } : {}),
  } as Partial<TRule>;
};
