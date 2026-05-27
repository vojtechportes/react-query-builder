import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';

const StyledButton = styled.button<{ $theme: Required<IThemeProps> }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.2rem;
  color: ${({ $theme }) => $theme.colors.primary.contrastText};
  font-size: 0.7rem;
  min-height: 2rem;
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: ${({ $theme }) => $theme.colors.primary.default};
  border: 0;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.primary.dark};
  }
`;

export interface IButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  'data-test'?: string;
  label?: string;
  children?: React.ReactNode;
}

export const Button: FC<IButtonProps> = ({
  onClick,
  disabled = false,
  className,
  title,
  children,
  label,
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled || undefined}
      className={className}
      title={title}
      data-test={dataTest}
      $theme={theme}
    >
      {children || label}
    </StyledButton>
  );
};
