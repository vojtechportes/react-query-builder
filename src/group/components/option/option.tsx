import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import styles from './option.module.css';

export interface IOptionProps {
  children: React.ReactNode;
  value: any;
  onClick: (value: any) => void;
  disabled: boolean;
  isSelected: boolean;
  className?: string;
}

export const Option: FC<IOptionProps> = ({
  children,
  onClick,
  disabled,
  value,
  isSelected,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(value);
    }
  }, [disabled, onClick, value]);

  return (
    <div
      className={clsx(
        styles.option,
        isSelected && styles.selected,
        disabled && styles.disabled,
        className
      )}
      data-disabled={disabled}
      data-selected={isSelected}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
