import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { ILockToggleProps } from '../../../lock-toggle';
import {
  getNextGroupLockState,
  getNextRuleLockState,
} from '../../../utils/lock-state';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { LockStateIcon } from '../icons';
import { getMuiLockTitle, useMuiBuilderStrings } from './copy';

export const MuiLockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useMuiBuilderStrings();
  const resolvedTitle = getMuiLockTitle(title, nodeType, state, strings);

  return (
    <IconButton
      size="small"
      onClick={() => {
        if (!disabled) {
          onChange?.(
            nodeType === 'group'
              ? getNextGroupLockState(state)
              : getNextRuleLockState(state)
          );
        }
      }}
      disabled={disabled}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      sx={{
        ...muiControlDensitySx,
        width: muiControlDensitySx.height,
        minWidth: muiControlDensitySx.height,
        border: 1,
        borderColor: state === 'unlocked' ? 'divider' : 'primary.main',
        color: state === 'unlocked' ? 'text.secondary' : 'primary.main',
        borderRadius: 1,
      }}
    >
      <LockStateIcon state={state} fontSize="small" />
    </IconButton>
  );
};
