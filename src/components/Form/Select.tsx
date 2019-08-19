import React from 'react';

import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledSelect = styled.select`
  padding: 0.2rem 0.5rem;
  height: 1.6rem;
  line-height: 1.6rem;
  border: 1px solid ${colors.medium};
  border-radius: 3px;
`;

export interface SelectProps {
  values: { value: React.ReactText; label: string }[];
  selectedValue?: React.ReactText;
  emptyValue?: string;
  onChange: (value: any) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <StyledSelect
      onChange={handleChange}
      value={selectedValue}
      className={className}
    >
      <option value="" disabled>
        {emptyValue}
      </option>
      {values.map(({ value: optionValue, label: optionLabel }) => (
        <option value={optionValue} key={optionValue}>
          {optionLabel}
        </option>
      ))}
    </StyledSelect>
  );
};
