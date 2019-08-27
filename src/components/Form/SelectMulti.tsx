import React from 'react';
import { Select, SelectProps } from './Select';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const Container = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
`;

const OptionContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-auto--rows: min-content;
  align-self: center;
  grid-gap: 0.5rem;
`;

const Option = styled.span`
  color: ${colors.dark};
  border: 1px solid ${colors.dark};
  border-radius: 3rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
  line-height: 0.7rem;
  white-space: nowrap;
`;

const Delete = styled.span`
  cursor: pointer;
`;

export interface SelectMultiProps
  extends Pick<SelectProps, 'onChange' | 'values'> {
  onDelete: (value: string) => void;
  selectedValue: string[];
  emptyValue?: string;
}

export const SelectMulti: React.FC<SelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
}) => {
  return (
    <Container>
      <Select
        onChange={onChange}
        selectedValue=""
        emptyValue={emptyValue}
        values={values}
      />
      <OptionContainer>
        {selectedValue.map((value, key) => {
          const labelIndex = values.findIndex(item => item.value === value);

          return (
            <Option key={key}>
              {values[labelIndex].label}{' '}
              <Delete onClick={() => onDelete(value)} data-test="Delete">[x]</Delete>
            </Option>
          );
        })}
      </OptionContainer>
    </Container>
  );
};
