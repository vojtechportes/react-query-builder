import type { IBuilderOperatorValidationRule } from './builder-operator-validation-rule';

export interface IBuilderValidationConfig<TRule> {
  common?: Partial<TRule>;
  rules?: Array<IBuilderOperatorValidationRule<TRule>>;
}
