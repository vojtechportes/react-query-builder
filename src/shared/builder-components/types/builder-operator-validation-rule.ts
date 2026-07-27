import type { BuilderFieldOperator } from './builder-field-operator';

export type IBuilderOperatorValidationRule<TRule> = Partial<TRule> & {
  operators: BuilderFieldOperator[];
};
