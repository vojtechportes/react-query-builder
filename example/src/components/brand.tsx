import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../../src';

const Heading = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1.5rem;
  white-space: nowrap;
`;

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  background: linear-gradient(
    180deg,
    ${colors.primary.light} 0%,
    ${colors.primary.default} 100%
  );
  color: ${colors.white};
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  flex-shrink: 0;
`;

const Title = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  line-height: 1;
`;

const ReactText = styled.span`
  color: ${colors.primary.default};
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: -0.05em;
`;

const QueryBuilderText = styled.span`
  color: ${colors.grey['900']};
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.06em;
`;

export const Brand: FC = () => {
  return (
    <Heading>
      <Mark aria-hidden="true">QB</Mark>
      <Title>
        <ReactText>React</ReactText>
        <QueryBuilderText>Query Builder</QueryBuilderText>
      </Title>
    </Heading>
  );
};
