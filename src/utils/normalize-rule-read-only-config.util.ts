import {
  IRuleReadOnlyConfig,
  RuleReadOnly,
  RuleReadOnlyTarget,
} from './query-tree';
import { isRuleReadOnlyConfig } from './is-rule-read-only-config.util';

export interface IResolvedRuleReadOnly {
  enabled: boolean;
  targets?: RuleReadOnlyTarget[];
}

export const normalizeRuleReadOnlyConfig = (
  value?: RuleReadOnly
): IResolvedRuleReadOnly => {
  if (typeof value === 'boolean') {
    return {
      enabled: value,
    };
  }

  if (isRuleReadOnlyConfig(value)) {
    const resolvedValue = value as IRuleReadOnlyConfig;

    return {
      enabled: resolvedValue.enabled,
      ...(resolvedValue.targets?.length
        ? { targets: [...resolvedValue.targets] }
        : {}),
    };
  }

  return {
    enabled: false,
  };
};
