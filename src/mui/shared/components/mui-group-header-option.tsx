import React, { FC } from 'react';
import { ToggleButton } from '@mui/material';
import { IOptionProps } from '../../../group/option';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';

export const MuiGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <ToggleButton
    value={value}
    selected={isSelected}
    disabled={disabled}
    className={className}
    color="primary"
    size="small"
    sx={muiControlDensitySx}
    onClick={() => onClick(value)}
  >
    {children}
  </ToggleButton>
);
