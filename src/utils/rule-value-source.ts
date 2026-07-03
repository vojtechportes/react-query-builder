import {
  IFieldReferenceRuleNode,
  IDenormalizedRuleNode,
  INormalizedRuleNode,
  QueryRuleValueSource,
} from './query-tree';

type QueryRuleNode = IDenormalizedRuleNode | INormalizedRuleNode;

export const getRuleValueSource = (
  rule: { valueSource?: QueryRuleValueSource }
): QueryRuleValueSource => rule.valueSource ?? 'value';

export const isFieldComparisonRule = (
  rule: QueryRuleNode
): rule is IFieldReferenceRuleNode & Pick<INormalizedRuleNode, 'id' | 'parent'> =>
  getRuleValueSource(rule) === 'field';

export const isLiteralComparisonRule = (
  rule: QueryRuleNode
): boolean => getRuleValueSource(rule) === 'value';
