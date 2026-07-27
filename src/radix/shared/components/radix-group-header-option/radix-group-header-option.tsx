import clsx from 'clsx';
import React, { FC } from 'react';
import { IOptionProps } from '../../../../group/components/option';
import styles from './radix-group-header-option.module.css';

export const RadixGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <button
    type="button"
    className={clsx(
      styles.option,
      isSelected && styles.selected,
      disabled && styles.disabled,
      className
    )}
    disabled={disabled}
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
  >
    {children}
  </button>
);
