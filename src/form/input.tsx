import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';
import {
  inputControlStyles,
  inputTypographyStyles,
} from '../styles/input.styles';

const StyledInput = styled.input<{ $theme: Required<IThemeProps> }>`
  ${inputControlStyles}
  -moz-appearance: textfield;
  padding: 0 0.6rem;

  &::-webkit-date-and-time-value,
  &::-webkit-datetime-edit,
  &::-webkit-datetime-edit-fields-wrapper,
  &::-webkit-datetime-edit-text,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    ${inputTypographyStyles}
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
`;

export interface IInputProps {
  type: 'date' | 'number' | 'text';
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const Input: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <StyledInput
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      $theme={theme}
    />
  );
};
