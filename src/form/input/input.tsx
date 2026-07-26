import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import inputStyles from '../../styles/input.module.css';
import styles from './input.module.css';

export interface IInputProps {
  type: 'date' | 'number' | 'text';
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const Input: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      className={clsx(
        inputStyles.control,
        inputStyles.typography,
        styles.input,
        className
      )}
      disabled={disabled}
    />
  );
};
