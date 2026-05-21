import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { Option } from '../widgets/select-multi/components/option';
import { Trigger } from '../widgets/select-multi/components/trigger';
import { useSelectMulti } from '../widgets/select-multi/hooks/use-select-multi';
import { Popover } from './popover';

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

export interface ISelectProps {
  values: Array<{ value: string; label: string }>;
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
  const theme = useTheme();
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
    <Container ref={rootRef} className={className}>
      <HiddenInput
        type="hidden"
        id={id}
        name={name}
        value={selectedValue || ''}
        readOnly
      />
      <Trigger
        disabled={disabled}
        expanded={isOpen}
        id={id ? `${id}-trigger` : undefined}
        label={selectedOption?.label || emptyValue || 'Select value'}
        onClick={toggle}
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
              selected={value === selectedValue}
              onClick={handleSelect}
              theme={theme}
            />
          ))}
        </Popover>
      ) : null}
    </Container>
  );
};
