import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { Trigger } from '../widgets/select-multi/components/trigger';
import { Option } from '../widgets/select-multi/components/option';
import { useSelectMulti } from '../widgets/select-multi/hooks/use-select-multi';
import { getSelectedOptions } from '../widgets/select-multi/utils/get-selected-options.util';
import { createSummary } from '../widgets/select-multi/utils/create-summary.util';
import { Popover } from './popover';
import { ISelectProps } from './select';

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: var(--query-builder-control-width, 160px);
  min-width: var(--query-builder-control-min-width, 160px);
  max-width: 100%;
`;

const HiddenInput = styled.input`
  display: none;
`;

export interface ISelectMultiProps
  extends Pick<ISelectProps, 'onChange' | 'values' | 'id' | 'name'> {
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
  const theme = useTheme();
  const { isOpen, rootRef, toggle, triggerRef } = useSelectMulti({
    disabled,
  });
  const selectedOptions = getSelectedOptions(values, selectedValue);
  const selectedLabels = selectedOptions.map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : emptyValue || 'Select value';

  const handleToggleValue = (value: string) => {
    if (selectedValue.includes(value)) {
      onDelete(value);
      return;
    }

    onChange(value);
  };

  return (
    <Container ref={rootRef} className={className}>
      <HiddenInput
        type="hidden"
        id={id}
        name={name}
        value={selectedValue.join(',')}
        readOnly
      />
      <Trigger
        disabled={disabled}
        expanded={isOpen}
        id={id ? `${id}-trigger` : undefined}
        label={summary.text || emptyValue || 'Select value'}
        badgeContent={summary.hiddenCount > 0 ? `+${summary.hiddenCount}` : undefined}
        onClick={toggle}
        title={title}
        triggerRef={triggerRef}
        theme={theme}
      />
      {isOpen ? (
        <Popover theme={theme}>
          {values.map(({ value, label }) => (
            <Option
              key={value}
              value={value}
              label={label}
              selected={selectedValue.includes(value)}
              onClick={handleToggleValue}
              theme={theme}
            />
          ))}
        </Popover>
      ) : null}
    </Container>
  );
};
