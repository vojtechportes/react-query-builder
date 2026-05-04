import { IBuilderRangeValidation } from '../../builder';

export const mergeBuilderRangeValidation = <TValueValidation, TRangeValue>(
  baseRangeValidation:
    | IBuilderRangeValidation<TValueValidation, TRangeValue>
    | undefined,
  overrideRangeValidation:
    | IBuilderRangeValidation<TValueValidation, TRangeValue>
    | undefined
): IBuilderRangeValidation<TValueValidation, TRangeValue> | undefined => {
  if (!baseRangeValidation && !overrideRangeValidation) {
    return undefined;
  }

  return {
    ...baseRangeValidation,
    ...overrideRangeValidation,
    common: {
      ...baseRangeValidation?.common,
      ...overrideRangeValidation?.common,
    },
    start: {
      ...baseRangeValidation?.start,
      ...overrideRangeValidation?.start,
    },
    end: {
      ...baseRangeValidation?.end,
      ...overrideRangeValidation?.end,
    },
  };
};
