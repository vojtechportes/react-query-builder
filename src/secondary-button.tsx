import styled from 'styled-components';
import { Button, IButtonProps } from './button';
import React, { FC, PropsWithChildren } from 'react';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';

export const StyledSecondaryButton = styled(Button)<
  IButtonProps & { $theme: Required<IThemeProps> }
>`
  background-color: ${({ $theme }) => $theme.colors.secondary.light};
  border: 1px solid ${({ $theme }) => $theme.colors.secondary.dark};
  color: ${({ $theme }) => $theme.colors.secondary.contrastText};

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.secondary.default};
  }
`;

export const SecondaryButton: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <StyledSecondaryButton $theme={theme} {...rest}>
      {children}
    </StyledSecondaryButton>
  );
};
