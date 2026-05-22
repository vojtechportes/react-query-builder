import React, { FC } from 'react';
import { Button } from 'antd';
import { IOptionProps } from '../../../group/option';
import { antdControlStyle } from './styles';

export const AntdGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <Button
    type={isSelected ? 'primary' : 'default'}
    className={className}
    disabled={disabled}
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    style={{
      ...antdControlStyle,
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,
    }}
  >
    {children}
  </Button>
);
