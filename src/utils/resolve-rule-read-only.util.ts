import { RuleReadOnly, RuleReadOnlyTarget } from './query-tree';
import {
  IResolvedRuleReadOnly,
  normalizeRuleReadOnlyConfig,
} from './normalize-rule-read-only-config.util';

export const resolveRuleReadOnly = (
  value?: RuleReadOnly
): IResolvedRuleReadOnly => normalizeRuleReadOnlyConfig(value);

export const getRuleReadOnlyTargets = (
  value?: RuleReadOnly
): RuleReadOnlyTarget[] => {
  const resolvedReadOnly = resolveRuleReadOnly(value);

  if (!resolvedReadOnly.enabled) {
    return [];
  }

  return resolvedReadOnly.targets?.length
    ? [...resolvedReadOnly.targets]
    : ['field', 'operator', 'value'];
};

export const isRuleFullyReadOnly = (value?: RuleReadOnly): boolean => {
  const resolvedReadOnly = resolveRuleReadOnly(value);
  return resolvedReadOnly.enabled && !resolvedReadOnly.targets?.length;
};
