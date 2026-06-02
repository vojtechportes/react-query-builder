import React, { FC } from 'react';
import { ISwitchProps } from '../../../form/switch';
import { joinClassNames } from './styles';

export const BootstrapSwitch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => (
  <div className={joinClassNames('form-check form-switch mb-0', className)}>
    <input
      type="checkbox"
      role="switch"
      className="form-check-input"
      checked={switched}
      disabled={disabled}
      onChange={event => onChange?.(event.target.checked)}
    />
  </div>
);
