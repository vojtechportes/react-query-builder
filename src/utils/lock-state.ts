import { GroupReadOnly, RuleReadOnly } from './query-tree';
import { normalizeRuleReadOnlyConfig } from './normalize-rule-read-only-config.util';
import { resolveGroupReadOnly } from './resolve-group-read-only.util';

export type BuilderLockState = 'unlocked' | 'self' | 'all';

export const resolveRuleLockState = (value?: RuleReadOnly): BuilderLockState =>
  normalizeRuleReadOnlyConfig(value).enabled ? 'self' : 'unlocked';

export const resolveGroupLockState = (
  value?: GroupReadOnly
): BuilderLockState => {
  const resolvedReadOnly = resolveGroupReadOnly(value);

  if (!resolvedReadOnly.enabled) {
    return 'unlocked';
  }

  if (resolvedReadOnly.inheritToChildren) {
    return 'all';
  }

  return 'self';
};

export const getNextRuleLockState = (
  state: BuilderLockState
): BuilderLockState => (state === 'self' ? 'unlocked' : 'self');

export const getNextGroupLockState = (
  state: BuilderLockState
): BuilderLockState => {
  if (state === 'unlocked') {
    return 'self';
  }

  if (state === 'self') {
    return 'all';
  }

  return 'unlocked';
};
