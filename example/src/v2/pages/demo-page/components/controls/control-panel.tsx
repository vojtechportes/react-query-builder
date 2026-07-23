import * as React from 'react';
import styled from 'styled-components';

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

export interface IControlPanelProps {
  children: React.ReactNode;
  title: string;
}

export const ControlPanel: React.FC<IControlPanelProps> = ({
  children,
  title,
}) => (
  <Panel>
    <PanelTitle>{title}</PanelTitle>
    {children}
  </Panel>
);
