import type { BuilderFieldComparisonType } from './builder-field-comparison-type';

export interface IBuilderFieldComparisonConfig {
  type?: BuilderFieldComparisonType;
  comparableFields?: string[];
}
