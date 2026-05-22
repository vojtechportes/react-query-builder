import React, { FC } from 'react';
import { Input, InputNumber } from 'antd';
import { IInputProps } from '../../../form/input';
import { antdControlStyle } from './styles';

export const AntdInput: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  if (type === 'number') {
    return (
      <InputNumber
        id={id}
        name={name}
        value={value === '' ? null : Number(value)}
        onChange={nextValue => onChange(nextValue == null ? '' : String(nextValue))}
        className={className}
        disabled={disabled}
        style={{ ...antdControlStyle, width: '100%' }}
        controls={false}
      />
    );
  }

  return (
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      className={className}
      disabled={disabled}
      style={antdControlStyle}
    />
  );
};
