import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

const StyledGroup = styled.div`
  margin: 0.5rem 0;
  padding: 0.7rem;
  background: #f4f4f4;
  border: 1px solid ${colors.medium};
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.15);
`;

const GroupHeader = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  padding: 0 0 0.5rem;
  border-bottom: 1px solid ${colors.medium};
`;

const Left = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-self: end;
  justify-self: start;

  > div:first-child {
    border-right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  > div:last-child {
    border-left: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  > div:nth-child(2) {
    border-right: 0;
    border-left: 0;
  }
`;

const Right = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-self: end;
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
