import React, { FC } from 'react';
import { Button } from '@mui/material';
import { IButtonProps } from '../../../button';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { resolveButtonContent } from './button-utils';

export const MuiAddButton: FC<IButtonProps> = (props) => (
  <Button
    variant="contained"
    color="primary"
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    data-test={props['data-test']}
    size="small"
    sx={{
      ...muiControlDensitySx,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}
  >
    {resolveButtonContent(props)}
  </Button>
);
