import React, { FC } from 'react';
import { Switch } from 'antd';
import { ISwitchProps } from '../../../builder/components/form-controls/switch';

export const AntdSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <Switch
    checked={switched}
    onChange={(checked) => onChange?.(checked)}
    disabled={disabled}
    className={className}
    size="small"
    data-test="Switch"
  />
);
