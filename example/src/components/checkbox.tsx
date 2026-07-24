import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '@vojtechportes/react-query-builder';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${colors.grey['900']};
  cursor: pointer;
`;

const StyledInput = styled.input`
  margin: 0;
`;

export interface ICheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export const Checkbox: FC<ICheckboxProps> = ({ checked, label, onChange }) => {
  return (
    <StyledLabel>
      <StyledInput
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </StyledLabel>
  );
};
