import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import { getLockToggleTitle } from '../utils/get-lock-toggle-title.util';
import {
  BuilderLockState,
  getNextGroupLockState,
  getNextRuleLockState,
} from '../utils/lock-state';
import { LockIcon } from './lock-icon';
import styles from './lock-toggle.module.css';

export interface ILockToggleProps {
  state: BuilderLockState;
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onChange?: (nextState: BuilderLockState) => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}

export const LockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const handleClick = useCallback(() => {
    if (disabled || !onChange) {
      return;
    }

    onChange(
      nodeType === 'group'
        ? getNextGroupLockState(state)
        : getNextRuleLockState(state)
    );
  }, [disabled, nodeType, onChange, state]);

  const resolvedTitle = title || getLockToggleTitle(undefined, nodeType, state);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        styles.lockToggle,
        styles[state],
        disabled && styles.disabled,
        className
      )}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
    >
      <LockIcon state={state} />
    </button>
  );
};
