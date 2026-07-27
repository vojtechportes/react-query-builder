import type { IBuilderRangeValidation } from './builder-range-validation';
import type { IDateValueValidationRule } from './date-value-validation-rule';

export interface IDateFieldValidationRule extends IDateValueValidationRule {
  range?: IBuilderRangeValidation<IDateValueValidationRule, string>;
}
