import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledComponent = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  padding: 0.7rem;
  margin: 0.5rem 0;
  border: 1px solid ${colors.medium};
  background-color: #fff;
`;

export interface ComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  children,
  className,
}) => <StyledComponent className={className}>{children}</StyledComponent>;
