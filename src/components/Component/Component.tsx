import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledComponent = styled.div`
  display: grid;
  grid-auto-flow: column;
  margin: 0.5rem 0;
  padding: 0.7rem;
  background-color: #fff;
  border: 1px solid ${colors.medium};
`;

const Content = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
`;

const Controls = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-self: flex-end;
`;

export interface ComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  controls: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  children,
  controls,
  className,
}) => (
  <StyledComponent className={className}>
    <Content>{children}</Content>
    <Controls>{controls}</Controls>
  </StyledComponent>
);
