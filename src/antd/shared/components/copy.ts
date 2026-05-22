import { useContext } from 'react';
import { BuilderContext } from '../../../builder-context';
import { BuilderLockState } from '../../../utils/lock-state';
import { getCloneButtonTitle } from '../../../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../../utils/get-lock-toggle-title.util';

export const useAntdBuilderStrings = () => useContext(BuilderContext).strings;

export const getAntdSelectPlaceholder = (
  placeholder: string | undefined,
  fallback: string | undefined
) => placeholder || fallback || 'Select your value';

export const getAntdCloneTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  fallbackStrings: ReturnType<typeof useAntdBuilderStrings>
) => title || getCloneButtonTitle(fallbackStrings, nodeType);

export const getAntdLockTitle = (
  title: string | undefined,
  nodeType: 'rule' | 'group',
  state: BuilderLockState,
  fallbackStrings: ReturnType<typeof useAntdBuilderStrings>
) => title || getLockToggleTitle(fallbackStrings, nodeType, state);
