import React, { FC } from 'react';
import styled from 'styled-components';
import { compactBuilderMedia } from '../styles/responsive.styles';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const StyledRule = styled.div<{
  hasDragHandle: boolean;
  $theme: Required<IThemeProps>;
}>`
  display: grid;
  grid-template-columns: ${({ hasDragHandle }) =>
    hasDragHandle ? 'auto 1fr auto' : '1fr auto'};
  background-color: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Content = styled.div`
  display: grid;
  min-width: 0;
  padding: 0.7rem 0 0.7rem 0.7rem;
`;

const Controls = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  align-self: start;
  justify-self: flex-end;
  padding: 0.7rem;

  ${compactBuilderMedia`
    padding-left: 0.5rem;
  `}
`;

export interface IRuleProps {
  children: React.ReactNode;
  controls: React.ReactNode;
  dragHandle?: React.ReactNode;
  className?: string;
  'data-test'?: string;
}

export const Rule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  return (
    <StyledRule
      className={className}
      hasDragHandle={Boolean(dragHandle)}
      data-test={dataTest}
      $theme={theme}
    >
      {dragHandle}
      <Content>{children}</Content>
      <Controls>{controls}</Controls>
    </StyledRule>
  );
};
