import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { Trigger } from '../widgets/select-multi/components/trigger';
import { Option } from '../widgets/select-multi/components/option';
import { Tag } from '../widgets/select-multi/components/tag';
import { useSelectMulti } from '../widgets/select-multi/hooks/use-select-multi';
import { getSelectedOptions } from '../widgets/select-multi/utils/get-selected-options.util';
import { Popover } from './popover';
import { ISelectProps } from './select';

const Container = styled.div`
  display: inline-grid;
  grid-template-columns: min-content max-content;
  align-items: center;
  gap: 0.35rem;
  width: max-content;
  max-width: 100%;
`;

const TriggerContainer = styled.div`
  position: relative;
  flex: 0 0 auto;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  align-self: center;
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
      <TriggerContainer>
        <Trigger
          disabled={disabled}
          expanded={isOpen}
          id={id ? `${id}-trigger` : undefined}
          label={emptyValue || 'Select value'}
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
                selected={selectedValue.includes(value)}
                onClick={handleToggleValue}
                theme={theme}
              />
            ))}
          </Popover>
        ) : null}
      </TriggerContainer>
      <Tags>
        {selectedOptions.map(({ value, label }) => (
          <Tag
            key={value}
            disabled={disabled}
            label={label}
            value={value}
            onRemove={onDelete}
            theme={theme}
          />
        ))}
      </Tags>
    </Container>
  );
};
