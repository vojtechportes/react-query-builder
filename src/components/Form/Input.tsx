import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledInput = styled.input`
  min-width: 160px;
  padding: 0.4rem 0.6rem;
  border: 1px solid ${colors.medium};
  border-radius: 3px;
`;

export interface InputProps {
  type: 'date' | 'number' | 'text';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <StyledInput
      type={type}
      value={value}
      onChange={handleChange}
      className={className}
      disabled={disabled}
    />
  );
};
