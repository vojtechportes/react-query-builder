import type { IBuilderRangeValidation } from './builder-range-validation';
import type { ITextValueValidationRule } from './text-value-validation-rule';

export interface ITextFieldValidationRule extends ITextValueValidationRule {
  range?: IBuilderRangeValidation<ITextValueValidationRule, string>;
}
