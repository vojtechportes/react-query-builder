import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const StyledSelect = styled.select<{ $theme: Required<IThemeProps> }>`
  min-width: 160px;
  padding: 0.4rem 0.6rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 3px;
`;

export interface ISelectProps {
  values: Array<{ value: string; label: string }>;
  selectedValue?: string;
  emptyValue?: string;
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
}

export const Select: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
}) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!disabled) {
        onChange(event.target.value);
      }
    },
    [disabled, onChange]
  );

  return (
    <StyledSelect
      onChange={handleChange}
      value={selectedValue}
      className={className}
      disabled={disabled}
      $theme={theme}
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
