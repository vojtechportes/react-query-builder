import React, { FC } from 'react';
import { TextField } from '@mui/material';
import { IInputProps } from '../../../form/input';

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
    onChange={event => onChange(event.target.value)}
    className={className}
    disabled={disabled}
    size="small"
    fullWidth
    variant="outlined"
    slotProps={{ htmlInput: { 'data-test': 'Input' } }}
  />
);
