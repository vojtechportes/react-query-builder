import React, { FC } from 'react';
import { Button } from '@mui/material';
import { IButtonProps } from '../../../button';
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
    sx={{ textTransform: 'none', whiteSpace: 'nowrap', minHeight: '2rem' }}
  >
    {resolveButtonContent(props)}
  </Button>
);
