export const fieldOptionTypesSignature = `export type BuilderFieldOption = {
  value: string | number;
  label: string;
};

export type BuilderFieldOptionsStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export interface IBuilderFieldOptionState {
  options: BuilderFieldOption[];
  status: BuilderFieldOptionsStatus;
}

export interface IBuilderRuleValueReconciliationConfig {
  strategy: 'clear-if-missing';
}

export interface IBuilderRuleDependencyEntry {
  ruleId: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
}

export type IBuilderFieldDependencyEntry = IBuilderRuleDependencyEntry;

export interface INearestFieldMatch {
  nodeId: string;
  field: string;
  valueSource?: QueryRuleValueSource;
  value: QueryRuleValue | undefined;
  valueField?: string;
  operator?: QueryOperator;
}

export interface IBuilderFieldChange {
  nodeId: string;
  field: string;
  previousValueSource?: QueryRuleValueSource;
  previousValue: QueryRuleValue | undefined;
  previousValueField?: string;
  valueSource?: QueryRuleValueSource;
  value: QueryRuleValue | undefined;
  valueField?: string;
  data: DenormalizedQuery;
};`;
