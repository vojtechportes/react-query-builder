import { normalizeGroupReadOnlyConfig } from '../normalize-group-read-only-config.util';
import { GroupReadOnly } from '../query-tree';

const hasGroupReadOnlyTargets = (value?: GroupReadOnly): boolean => {
  const normalizedValue = normalizeGroupReadOnlyConfig(value);

  return Boolean(normalizedValue.targets?.length);
};

export const updateGroupLockState = (
  value: GroupReadOnly | undefined,
  state: 'unlocked' | 'self' | 'all'
): GroupReadOnly | undefined => {
  if (typeof value !== 'boolean' && typeof value !== 'undefined') {
    if (state === 'unlocked') {
      if (!hasGroupReadOnlyTargets(value)) {
        return undefined;
      }

      return {
        ...value,
        enabled: false,
        inheritToChildren: false,
      };
    }

    return {
      ...value,
      enabled: true,
      inheritToChildren: state === 'all',
    };
  }

  if (state === 'unlocked') {
    return undefined;
  }

  if (state === 'self') {
    return true;
  }

  return {
    enabled: true,
    inheritToChildren: true,
  };
};
