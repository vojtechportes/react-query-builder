import { useContext } from 'react';
import { BuilderContext } from '../../../builder-context';
import { BuilderLockState } from '../../../utils/lock-state';
import { getCloneButtonTitle } from '../../../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../../utils/get-lock-toggle-title.util';

export const useMuiBuilderStrings = () => useContext(BuilderContext).strings;

export const getMuiSelectPlaceholder = (
  placeholder: string | undefined,
  fallback: string | undefined
) => placeholder || fallback || 'Select your value';

export const getMuiCloneTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  fallbackStrings: ReturnType<typeof useMuiBuilderStrings>
) => title || getCloneButtonTitle(fallbackStrings, nodeType);

export const getMuiLockTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState,
  fallbackStrings: ReturnType<typeof useMuiBuilderStrings>
) => title || getLockToggleTitle(fallbackStrings, nodeType, state);
