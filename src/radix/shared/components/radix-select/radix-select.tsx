import { Select } from '@radix-ui/themes';
import React, { FC, useContext } from 'react';
import { BuilderContext } from '../../../../builder-context';
import { ISelectProps } from '../../../../form/select';
import { getRadixSelectPlaceholder } from '../../utils/get-radix-select-placeholder.util';
import styles from './radix-select.module.css';

export const RadixSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const strings = useContext(BuilderContext).strings;
  const placeholder = getRadixSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <Select.Root
      value={selectedValue || undefined}
      onValueChange={(value) => onChange(value)}
      disabled={disabled}
      name={name}
      size="2"
    >
      <input
        className={styles.hiddenInput}
        type="hidden"
        id={id}
        name={name}
        value={selectedValue || ''}
        readOnly
      />
      <Select.Trigger
        className={className}
        data-test="SelectTrigger"
        variant="classic"
        radius="medium"
        style={{ width: '100%' }}
        {...({ placeholder } as { placeholder: string })}
      />
      <Select.Content variant="solid" highContrast position="popper">
        {values.map(({ value, label }) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
