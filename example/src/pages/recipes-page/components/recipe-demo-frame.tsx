import * as React from 'react';
import styled from 'styled-components';
import { recipeDemoButtonStyles } from '../styles/recipe-demo-button.styles';

const Root = styled.section`
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0 2rem;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: space-between;
  gap: 0.75rem;

  > div {
    display: grid;
    gap: 0.75rem;
  }

  p {
    margin: 0;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.3rem;
`;

const Badge = styled.span<{ $kind: 'live' | 'mock' | 'experimental' }>`
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: ${({ $kind }) =>
    $kind === 'live' ? '#dcfce7' : $kind === 'mock' ? '#fef3c7' : '#ede9fe'};
  color: #1e293b;
  font-size: 0.8rem;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  > button {
    ${recipeDemoButtonStyles}
  }
`;

const Surface = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  overflow-x: auto;
`;

export interface IRecipeDemoFrameProps {
  title: string;
  kind?: 'live' | 'mock' | 'experimental';
  note: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const RecipeDemoFrame: React.FC<IRecipeDemoFrameProps> = ({
  title,
  kind = 'live',
  note,
  actions,
  children,
}) => (
  <Root aria-label={`${title} interactive demo`}>
    <Header>
      <div>
        <Title>{title}</Title>
        <p>{note}</p>
      </div>
      <Badge $kind={kind}>
        {kind === 'live'
          ? 'Live demo'
          : kind === 'mock'
            ? 'Mock API'
            : 'Experimental simulation'}
      </Badge>
    </Header>
    {actions ? <Actions>{actions}</Actions> : null}
    <Surface>{children}</Surface>
  </Root>
);
