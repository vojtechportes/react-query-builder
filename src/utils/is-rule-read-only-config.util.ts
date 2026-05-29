import { IRuleReadOnlyConfig, RuleReadOnly } from './query-tree';

export const isRuleReadOnlyConfig = (
  value: RuleReadOnly | undefined
): value is IRuleReadOnlyConfig =>
  typeof value === 'object' && value !== null && 'enabled' in value;
