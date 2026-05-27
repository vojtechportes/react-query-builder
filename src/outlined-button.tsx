import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Button, IButtonProps } from './button';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';

const StyledOutlinedButton = styled(Button)<{
  $theme: Required<IThemeProps>;
}>`
  background-color: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  color: ${({ $theme }) => $theme.colors.grey['700']};
  text-transform: none;
  font-size: 0.75rem;
  padding: 0.5rem 0.9rem;

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    border-color: ${({ $theme }) => $theme.colors.grey['400']};
    color: ${({ $theme }) => $theme.colors.grey['800']};
  }

  &:disabled {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    border-color: ${({ $theme }) => $theme.colors.grey['200']};
    color: ${({ $theme }) => $theme.colors.grey['400']};
    cursor: not-allowed;
  }

  &:disabled:hover {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    border-color: ${({ $theme }) => $theme.colors.grey['200']};
    color: ${({ $theme }) => $theme.colors.grey['400']};
  }
`;

export const OutlinedButton: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <StyledOutlinedButton $theme={theme} {...rest}>
      {children}
    </StyledOutlinedButton>
  );
};
