import clsx from 'clsx';
import React, { FC } from 'react';
import { Option } from '../../widgets/select-multi/components/option';
import { Trigger } from '../../widgets/select-multi/components/trigger';
import { useSelectMulti } from '../../widgets/select-multi/hooks/use-select-multi';
import { createSummary } from '../../widgets/select-multi/utils/create-summary.util';
import { getSelectedOptions } from '../../widgets/select-multi/utils/get-selected-options.util';
import { Popover } from '../popover';
import { ISelectProps } from '../select';
import styles from './select-multi.module.css';

export interface ISelectMultiProps extends Pick<
  ISelectProps,
  'onChange' | 'values' | 'id' | 'name'
> {
  onDelete: (value: string) => void;
  selectedValue: string[];
  emptyValue?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectMulti: FC<ISelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
  className,
  disabled = false,
  id,
  name,
}) => {
  const { isOpen, rootRef, toggle, triggerRef } = useSelectMulti({
    disabled,
  });
  const selectedOptions = getSelectedOptions(values, selectedValue);
  const selectedLabels = selectedOptions.map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text
    ? selectedLabels.join(', ')
    : emptyValue || 'Select value';

  const handleToggleValue = (value: string) => {
    if (selectedValue.includes(value)) {
      onDelete(value);
      return;
    }

    onChange(value);
  };

  return (
    <div ref={rootRef} className={clsx(styles.container, className)}>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValue.join(',')}
        readOnly
        className={styles.hiddenInput}
      />
      <Trigger
        disabled={disabled}
        expanded={isOpen}
        id={id ? `${id}-trigger` : undefined}
        label={summary.text || emptyValue || 'Select value'}
        badgeContent={
          summary.hiddenCount > 0 ? `+${summary.hiddenCount}` : undefined
        }
        onClick={toggle}
        title={title}
        triggerRef={triggerRef}
      />
      {isOpen ? (
        <Popover>
          {values.map(({ value, label }) => (
            <Option
              key={value}
              value={value}
              label={label}
              selected={selectedValue.includes(value)}
              onClick={handleToggleValue}
            />
          ))}
        </Popover>
      ) : null}
    </div>
  );
};
