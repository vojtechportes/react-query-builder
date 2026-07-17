import React, { FC } from 'react';
import { Button } from '@mui/material';
import { IButtonProps } from '../../../button';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { resolveButtonContent } from './button-utils';

export const MuiOutlinedButton: FC<IButtonProps> = (props) => (
  <Button
    variant="outlined"
    color="secondary"
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    data-test={props['data-test']}
    size="small"
    sx={{
      ...muiControlDensitySx,
      textTransform: 'none',
      whiteSpace: 'nowrap',
    }}
  >
    {resolveButtonContent(props)}
  </Button>
);
