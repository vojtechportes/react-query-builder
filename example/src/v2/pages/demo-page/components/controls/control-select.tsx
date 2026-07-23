import * as React from 'react';
import styled from 'styled-components';
import { siteTheme } from '../../../../../constants/site-theme';

const SelectField = styled.label`
  display: grid;
  gap: 0.35rem;
`;

const SelectFieldLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 400;
  color: #334155;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.68rem 2.2rem 0.68rem 0.85rem;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font-size: 0.92rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;

  &:focus {
    outline: none;
    border-color: ${siteTheme.primaryLight};
    box-shadow: 0 0 0 3px ${siteTheme.primaryGlow};
  }
`;

export interface IControlSelectProps {
  children: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ControlSelect: React.FC<IControlSelectProps> = ({
  children,
  label,
  value,
  onChange,
}) => (
  <SelectField>
    <SelectFieldLabel>{label}</SelectFieldLabel>
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </Select>
  </SelectField>
);
