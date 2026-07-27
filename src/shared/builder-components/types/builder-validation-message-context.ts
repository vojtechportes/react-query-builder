import type { BuilderFieldOperator } from './builder-field-operator';
import type { BuilderFieldValue } from './builder-field-value';
import type { IBuilderFieldUsageLimit } from './builder-field-usage-limit';
import type { IBuilderFieldProps } from './builder-field-props';

export interface IBuilderValidationMessageContext {
  field: IBuilderFieldProps;
  operator?: BuilderFieldOperator;
  value?: BuilderFieldValue;
  ruleId?: string;
  rangeBoundary?: 'start' | 'end';
  usageLimit?: IBuilderFieldUsageLimit;
}
