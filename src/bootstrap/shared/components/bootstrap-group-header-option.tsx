import React, { FC } from 'react';
import { IOptionProps } from '../../../group/option';
import { joinClassNames } from './styles';

export const BootstrapGroupHeaderOption: FC<IOptionProps> = ({
  children,
  onClick,
  disabled,
  value,
  isSelected,
  className,
}) => (
  <button
    type="button"
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    disabled={disabled}
    className={joinClassNames(
      'btn',
      isSelected ? 'btn-primary' : 'btn-outline-secondary',
      className
    )}
  >
    {children}
  </button>
);
