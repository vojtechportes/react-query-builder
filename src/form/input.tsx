import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const StyledInput = styled.input<{ $theme: Required<IThemeProps> }>`
  box-sizing: border-box;
  appearance: none;
  -moz-appearance: textfield;
  min-width: 160px;
  height: 2rem;
  padding: 0 0.6rem;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  font-size: 0.8rem;
  line-height: calc(2rem - 2px);
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 3px;

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
