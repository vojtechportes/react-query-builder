import React, { FC } from 'react';
import { TextField } from '@mui/material';
import { IInputProps } from '../../../form/input';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';

export const MuiInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <TextField
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={className}
    disabled={disabled}
    size="small"
    fullWidth
    variant="outlined"
    slotProps={{ htmlInput: { 'data-test': 'Input' } }}
    sx={{
      '& .MuiInputBase-root': muiControlDensitySx,
      '& .MuiInputBase-input': {
        boxSizing: 'border-box',
        height: '100%',
        padding: '6px 14px',
        fontSize: muiControlDensitySx.fontSize,
      },
    }}
  />
);
