import React, { FC } from 'react';
import { MenuItem } from '@mui/material';
import { IPopoverItemProps } from '../../../popover-item';

export const MuiPopoverItem: FC<IPopoverItemProps> = ({
  label,
  onClick,
  className,
  'data-test': dataTest,
}) => (
  <MenuItem
    onClick={(event) =>
      onClick(event as unknown as React.MouseEvent<HTMLButtonElement>)
    }
    className={className}
    data-test={dataTest}
  >
    {label}
  </MenuItem>
);
