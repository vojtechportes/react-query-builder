import React, { FC } from 'react';
import { ISelectProps } from '../../../form/select';
import { bootstrapControlStyles, joinClassNames } from './styles';

export const BootstrapSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => (
  <select
    id={id}
    name={name}
    value={selectedValue ?? ''}
    onChange={event => onChange(event.target.value)}
    className={joinClassNames('form-select form-select-sm', className)}
    style={bootstrapControlStyles}
    disabled={disabled}
  >
    <option value="">{emptyValue || 'Select value'}</option>
    {values.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);
