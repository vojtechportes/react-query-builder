import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import { ITextModeInputProps } from '../../types/text-mode-input-props';
import styles from './text-mode-input.module.css';

export const TextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={clsx(styles.root, className)}>
      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={spellCheck}
        className={clsx(styles.field, inputClassName)}
        data-test={inputDataTest}
      />
    </div>
  );
};
