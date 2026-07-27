export const fieldComparisonConfigSignature = `export type BuilderFieldComparisonType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean';

export interface IBuilderFieldComparisonConfig {
  type?: BuilderFieldComparisonType;
  comparableFields?: string[];
}`;
