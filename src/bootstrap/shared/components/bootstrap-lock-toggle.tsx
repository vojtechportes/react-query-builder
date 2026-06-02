import React, { FC, useCallback } from 'react';
import {
  ILockToggleProps,
} from '../../../lock-toggle';
import {
  BuilderLockState,
  getNextGroupLockState,
  getNextRuleLockState,
} from '../../../utils/lock-state';
import { getLockToggleTitle } from '../../../utils/get-lock-toggle-title.util';
import { BootstrapLockIcon } from './icons';
import {
  bootstrapIconButtonContentStyles,
  bootstrapIconButtonStyles,
  joinClassNames,
} from './styles';

const stateClassName: Record<BuilderLockState, string> = {
  all: 'btn-primary',
  self: 'btn-outline-primary',
  unlocked: 'btn-outline-secondary',
};

export const BootstrapLockToggle: FC<ILockToggleProps> = ({
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
      disabled={disabled}
      className={joinClassNames('btn btn-sm', stateClassName[state], className)}
      style={bootstrapIconButtonStyles}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
    >
      <span
        className="d-inline-flex align-items-center justify-content-center"
        style={bootstrapIconButtonContentStyles}
      >
        <BootstrapLockIcon state={state} />
      </span>
    </button>
  );
};
