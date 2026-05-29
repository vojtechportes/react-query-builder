import { normalizeRuleReadOnlyConfig } from '../normalize-rule-read-only-config.util';
import { RuleReadOnly } from '../query-tree';

const hasRuleReadOnlyTargets = (value?: RuleReadOnly): boolean => {
  const normalizedValue = normalizeRuleReadOnlyConfig(value);

  return Boolean(normalizedValue.targets?.length);
};

export const updateRuleLockState = (
  value: RuleReadOnly | undefined,
  state: 'unlocked' | 'self'
): RuleReadOnly | undefined => {
  if (state === 'self') {
    if (typeof value === 'boolean' || typeof value === 'undefined') {
      return true;
    }

    return {
      ...value,
      enabled: true,
    };
  }

  if (!hasRuleReadOnlyTargets(value)) {
    return undefined;
  }

  if (typeof value === 'boolean' || typeof value === 'undefined') {
    return undefined;
  }

  return {
    ...value,
    enabled: false,
  };
};
