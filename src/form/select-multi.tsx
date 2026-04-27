import React from 'react';
import styled from 'styled-components';
import { Option } from './option';
import { OptionContainer } from './option-container';
import { Select, SelectProps } from './select';

const Container = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
`;

const Delete = styled.span<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (!disabled ? `pointer` : 'default')};
`;

export interface SelectMultiProps
  extends Pick<SelectProps, 'onChange' | 'values'> {
  onDelete: (value: string) => void;
  selectedValue: string[];
  emptyValue?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectMulti: React.FC<SelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
  className,
  disabled = false,
}) => {
  return (
    <Container className={className}>
      <Select
        onChange={onChange}
        selectedValue=""
        emptyValue={emptyValue}
        values={values}
        disabled={disabled}
      />
      <OptionContainer>
        {selectedValue.map(value => {
          const labelIndex = values.findIndex(item => item.value === value);

          return (
            <Option key={value}>
              {values[labelIndex].label}{' '}
              <Delete
                onClick={() => !disabled && onDelete(value)}
                disabled={disabled}
                data-test="Delete"
              >
                [x]
              </Delete>
            </Option>
          );
        })}
      </OptionContainer>
    </Container>
  );
};
