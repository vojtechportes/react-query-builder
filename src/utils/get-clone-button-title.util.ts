import type { IStrings } from '../shared/localization/types/strings';

export const getCloneButtonTitle = (
  strings: IStrings | undefined,
  nodeType: 'rule' | 'group'
) => {
  if (nodeType === 'group') {
    return strings?.group?.clone || 'Clone group';
  }

  return strings?.rule?.clone || 'Clone rule';
};
