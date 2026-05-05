import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../../src';

const StyledSidepanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: ${colors.grey['100']};
  border: 1px solid ${colors.grey['300']};
`;

const StyledTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export interface ISidepanelProps {
  title: string;
  children: React.ReactNode;
}

export const Sidepanel: FC<ISidepanelProps> = ({ title, children }) => {
  return (
    <StyledSidepanel>
      <StyledTitle>{title}</StyledTitle>
      <StyledSection>{children}</StyledSection>
    </StyledSidepanel>
  );
};
