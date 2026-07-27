import type { BuilderFieldType } from './builder-field-type';
import type { BuilderFieldOperator } from './builder-field-operator';
import type { BuilderFieldValue } from './builder-field-value';
import type { IBuilderFieldUsageLimit } from './builder-field-usage-limit';
import type { IBuilderFieldComparisonConfig } from './builder-field-comparison-config';

export interface IBuilderFieldBase<
  TType extends BuilderFieldType,
  TValue extends BuilderFieldValue | undefined,
  TValidation,
> {
  field: string;
  label: string;
  value?: TValue;
  type: TType;
  operators?: BuilderFieldOperator[];
  validation?: TValidation;
  usageLimit?: IBuilderFieldUsageLimit;
  fieldComparison?: IBuilderFieldComparisonConfig;
}
