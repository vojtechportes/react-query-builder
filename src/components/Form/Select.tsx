import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledSelect = styled.select`
  min-width: 160px;
  padding: 0.4rem 0.6rem;
  border: 1px solid ${colors.medium};
  border-radius: 3px;
`;

export interface SelectProps {
  values: Array<{ value: string; label: string }>;
  selectedValue?: string;
  emptyValue?: string;
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!disabled) {
      onChange(event.target.value);
    }
  };

  return (
    <StyledSelect
      onChange={handleChange}
      value={selectedValue}
      className={className}
      disabled={!!disabled}
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
