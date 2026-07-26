import clsx from 'clsx';
import React, { FC } from 'react';
import { CheckIcon } from '../check-icon';
import styles from './option.module.css';

export interface IOptionProps {
  disabled?: boolean;
  label: string;
  selected: boolean;
  value: string;
  onClick: (value: string) => void;
}

export const Option: FC<IOptionProps> = ({
  disabled = false,
  label,
  selected,
  value,
  onClick,
}) => {
  return (
    <button
      type="button"
      data-test={`SelectMultiOption[${value}]`}
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={clsx(
        styles.option,
        disabled && styles.disabled,
        selected && styles.selected
      )}
      onClick={() => {
        if (!disabled) {
          onClick(value);
        }
      }}
    >
      <span className={styles.label}>{label}</span>
      <span
        className={clsx(styles.indicator, selected && styles.selectedIndicator)}
      >
        {selected ? <CheckIcon /> : null}
      </span>
    </button>
  );
};
