import type { IBuilderRangeValidation } from './builder-range-validation';
import type { INumberValueValidationRule } from './number-value-validation-rule';

export interface INumberFieldValidationRule extends INumberValueValidationRule {
  range?: IBuilderRangeValidation<INumberValueValidationRule, number>;
}
