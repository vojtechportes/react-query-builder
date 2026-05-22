import React, { FC } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { SvgIconProps } from '@mui/material';
import { BuilderLockState } from '../../builder';

export const CloneIcon: FC<SvgIconProps> = (props) => (
  <ContentCopyIcon {...props} />
);

export const LockStateIcon: FC<{ state: BuilderLockState } & SvgIconProps> = ({
  state,
  ...props
}) => {
  if (state === 'unlocked') {
    return <LockOpenIcon {...props} />;
  }

  if (state === 'self') {
    return <LockOutlinedIcon {...props} />;
  }

  return <LockIcon {...props} />;
};
