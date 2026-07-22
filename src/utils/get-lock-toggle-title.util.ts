import { BuilderLockState } from './lock-state';
import type { IStrings } from '../locales/types/strings';

export const getLockToggleTitle = (
  strings: IStrings | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState
) => {
  if (nodeType === 'rule') {
    return state === 'self'
      ? strings?.rule?.unlock || 'Unlock rule'
      : strings?.rule?.lock || 'Lock rule';
  }

  if (state === 'unlocked') {
    return strings?.group?.lock || 'Lock group';
  }

  if (state === 'self') {
    return strings?.group?.lockDescendants || 'Lock group and descendants';
  }

  return strings?.group?.unlockDescendants || 'Unlock group and descendants';
};
