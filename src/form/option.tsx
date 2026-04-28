import styled from 'styled-components';
import React, { FC, PropsWithChildren } from 'react';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { IThemeProps } from '../theme-provider/theme-provider';

export const StyledOption = styled.span<{
  $theme: Required<IThemeProps>;
}>`
  padding: 0.3rem 0.5rem;
  color: ${({ $theme }) => $theme.colors.grey['700']};
  font-size: 0.7rem;
  line-height: 0.7rem;
  white-space: nowrap;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['700']};
  border-radius: 3rem;
`;

export const Option: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return <StyledOption $theme={theme}>{children}</StyledOption>;
};
