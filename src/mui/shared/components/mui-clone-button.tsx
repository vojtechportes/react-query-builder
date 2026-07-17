import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { ICloneButtonProps } from '../../../clone-button';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { CloneIcon } from '../icons';
import { getMuiCloneTitle, useMuiBuilderStrings } from './copy';

export const MuiCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useMuiBuilderStrings();
  const resolvedTitle = getMuiCloneTitle(title, nodeType, strings);

  return (
    <IconButton
      size="small"
      onClick={onClick}
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
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <CloneIcon fontSize="small" />
    </IconButton>
  );
};
