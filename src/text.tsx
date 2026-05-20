import styled from 'styled-components';
import React, { FC, PropsWithChildren } from 'react';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';

export const StyledText = styled.span<{
  $theme: Required<IThemeProps>;
}>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  min-width: 160px;
  min-height: 2rem;
  padding: 0.4rem 0.6rem;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  font-size: 0.8rem;
  line-height: 1.3;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 3px;
`;

export const Text: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return <StyledText $theme={theme}>{children}</StyledText>;
};
