import React, { FC } from 'react';
import { Button } from '@mui/material';
import { IButtonProps } from '../../../button';
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
    sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap', minHeight: '2rem' }}
  >
    {resolveButtonContent(props)}
  </Button>
);
