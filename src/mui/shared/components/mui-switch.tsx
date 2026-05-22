import React, { FC } from 'react';
import { Switch } from '@mui/material';
import { ISwitchProps } from '../../../form/switch';

export const MuiSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Switch
    checked={switched}
    onChange={(_, checked) => onChange?.(checked)}
    disabled={disabled}
    className={className}
    slotProps={{ input: { 'data-test': 'Switch' } as never }}
    size="small"
  />
);
