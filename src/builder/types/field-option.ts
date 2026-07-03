import {
  DenormalizedQuery,
  QueryOperator,
  QueryRuleValue,
  QueryRuleValueSource,
} from '../../utils/query-tree';

export type BuilderFieldOption = {
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

export type BuilderRuleValueReconciliationStrategy = 'clear-if-missing';

export interface IBuilderRuleValueReconciliationConfig {
  strategy: BuilderRuleValueReconciliationStrategy;
}

export interface INearestFieldMatch {
  nodeId: string;
  field: string;
  valueSource?: QueryRuleValueSource;
  value: QueryRuleValue | undefined;
  valueField?: string;
  operator?: QueryOperator;
}

export interface IBuilderRuleDependencyEntry {
  ruleId: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
}

export type IBuilderFieldDependencyEntry = IBuilderRuleDependencyEntry;

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
}
