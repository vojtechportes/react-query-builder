import React, { FC } from 'react';
import { ToggleButtonGroup } from '@mui/material';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';

export interface IMuiGroupHeaderControlsProps {
  children: React.ReactNode;
}

export const MuiGroupHeaderControls: FC<IMuiGroupHeaderControlsProps> = ({
  children,
}) => {
  const options =
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.type === React.Fragment
      ? children.props.children
      : children;

  return (
    <ToggleButtonGroup color="primary" size="small" sx={muiControlDensitySx}>
      {options}
    </ToggleButtonGroup>
  );
};
