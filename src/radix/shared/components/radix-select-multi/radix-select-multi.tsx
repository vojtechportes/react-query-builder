import { Button, DropdownMenu } from '@radix-ui/themes';
import React, { FC, useContext } from 'react';
import { BuilderContext } from '../../../../builder-context';
import { ISelectMultiProps } from '../../../../form/select-multi';
import { createSummary } from '../../../../widgets/select-multi/utils/create-summary.util';
import { getRadixSelectPlaceholder } from '../../utils/get-radix-select-placeholder.util';
import styles from './radix-select-multi.module.css';

const buttonStyle = {
  minHeight: '2rem',
  whiteSpace: 'nowrap' as const,
};

export const RadixSelectMulti: FC<ISelectMultiProps> = ({
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
  const strings = useContext(BuilderContext).strings;
  const placeholder = getRadixSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );
  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;

  return (
    <>
      <input
        className={styles.hiddenInput}
        type="hidden"
        id={id}
        name={name}
        value={selectedValue.join(',')}
        readOnly
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            type="button"
            variant="classic"
            className={className}
            data-test="SelectMultiTrigger"
            title={title}
            disabled={disabled}
            radius="medium"
            style={{
              ...buttonStyle,
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span className={styles.triggerText}>
              <span>{summary.text || placeholder}</span>
              {summary.hiddenCount > 0 ? (
                <span
                  className={styles.badge}
                  data-test="SelectMultiSummaryBadge"
                >
                  +{summary.hiddenCount}
                </span>
              ) : null}
            </span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {values.map(({ value, label }) => (
            <DropdownMenu.CheckboxItem
              key={value}
              checked={selectedValue.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange(value);
                  return;
                }

                onDelete(value);
              }}
            >
              {label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
