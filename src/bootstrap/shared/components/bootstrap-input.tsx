import React, { FC } from 'react';
import { IInputProps } from '../../../form/input';
import { joinClassNames } from './styles';

export const BootstrapInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={event => onChange(event.target.value)}
    className={joinClassNames('form-control form-control-sm', className)}
    disabled={disabled}
  />
);
