export const fieldBaseSignature = `interface IBuilderFieldBase<TType, TValue, TValidation> {
  field: string;
  label: string;
  value?: TValue;
  type: TType;
  operators?: BuilderFieldOperator[];
  usageLimit?: IBuilderFieldUsageLimit;
  validation?: TValidation;
  fieldComparison?: IBuilderFieldComparisonConfig;
}`;
