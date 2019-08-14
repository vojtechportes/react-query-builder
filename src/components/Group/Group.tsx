import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledGroup = styled.div`
  background: #f4f4f4;
  border: 1px solid ${colors.medium};
  padding: 0.7rem;
  margin: 0.5rem 0;
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.15);
`;

const GroupHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 0 0 0.5rem;
  border-bottom: 1px solid ${colors.medium};
`;

const Left = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-self: flex-end;
  justify-self: flex-start;
`;

const Right = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-self: flex-end;
`;

export interface GroupProps {
  controlsLeft?: React.ReactNode | React.ReactNodeArray;
  controlsRight?: React.ReactNode | React.ReactNodeArray;
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

export const Group: React.FC<GroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  className,
}) => {
  return (
    <StyledGroup className={className}>
      <GroupHeader>
        <Left>{controlsLeft}</Left>
        <Right>{controlsRight}</Right>
      </GroupHeader>
      {children}
    </StyledGroup>
  );
};
