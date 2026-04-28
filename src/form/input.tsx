import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const StyledInput = styled.input<{ $theme: Required<IThemeProps> }>`
  min-width: 160px;
  padding: 0.4rem 0.6rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 3px;
`;

export interface IInputProps {
  type: 'date' | 'number' | 'text';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Input: FC<IInputProps> = ({
  type,
  value,
  onChange,
  className,
  disabled = false,
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
      type={type}
      value={value}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      $theme={theme}
    />
  );
};
