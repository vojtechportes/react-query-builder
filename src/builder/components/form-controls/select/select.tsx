import clsx from 'clsx';
import React, { FC, useMemo } from 'react';
import { Option } from '../../rule-controls/select-multi/components/option';
import { Trigger } from '../../rule-controls/select-multi/components/trigger';
import { useSelectMulti } from '../../rule-controls/select-multi/hooks/use-select-multi';
import { Popover } from '../popover';
import styles from './select.module.css';

export interface ISelectProps {
  values: Array<{ value: string; label: string; disabled?: boolean }>;
  selectedValue?: string;
  emptyValue?: string;
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const Select: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const { isOpen, close, rootRef, toggle, triggerRef } = useSelectMulti({
    disabled,
  });
  const selectedOption = useMemo(
    () => values.find(({ value }) => value === selectedValue),
    [selectedValue, values]
  );

  const handleSelect = (value: string) => {
    if (disabled) {
      return;
    }

    onChange(value);
    close();
  };

  return (
    <div ref={rootRef} className={clsx(styles.container, className)}>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValue || ''}
        readOnly
        className={styles.hiddenInput}
      />
      <Trigger
        disabled={disabled}
        expanded={isOpen}
        id={id ? `${id}-trigger` : undefined}
        label={selectedOption?.label || emptyValue || 'Select value'}
        onClick={toggle}
        triggerRef={triggerRef}
      />
      {isOpen ? (
        <Popover>
          {values.map(({ value, label, disabled: optionDisabled = false }) => (
            <Option
              key={value}
              value={value}
              label={label}
              selected={value === selectedValue}
              disabled={optionDisabled}
              onClick={handleSelect}
            />
          ))}
        </Popover>
      ) : null}
    </div>
  );
};
