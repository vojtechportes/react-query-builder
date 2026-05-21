import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

export interface IStyledOptionProps {
  isSelected: boolean;
  disabled: boolean;
  $theme: Required<IThemeProps>;
}

const StyledOption = styled.div<IStyledOptionProps>`
  padding: 0.5rem 0.6rem;
  color: ${({ $theme }) => $theme.colors.primary.contrastText};
  min-height: 2rem;
  font-weight: bold;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: ${({ isSelected, $theme }) =>
    isSelected ? $theme.colors.primary.default : $theme.colors.grey['500']};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['800']};
  cursor: pointer;

  ${({ disabled, isSelected, $theme }) =>
    disabled &&
    css`
      background: ${isSelected
        ? $theme.colors.grey['800']
        : $theme.colors.grey['500']};
      cursor: initial;
    `}
`;

export interface IOptionProps {
  children: React.ReactNode;
  value: any;
  onClick: (value: any) => void;
  disabled: boolean;
  isSelected: boolean;
  className?: string;
}

export const Option: FC<IOptionProps> = ({
  children,
  onClick,
  disabled,
  value,
  isSelected,
  className,
}) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(value);
    }
  }, [disabled, onClick, value]);

  return (
    <StyledOption
      className={className}
      isSelected={isSelected}
      disabled={disabled}
      onClick={handleClick}
      $theme={theme}
    >
      {children}
    </StyledOption>
  );
};
