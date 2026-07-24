import * as React from 'react';
import styled from 'styled-components';

const Root = styled.section`
  min-width: 0;
  padding: 0.75rem;
  border-radius: 10px;
  background: #0f172a;
  color: #e2e8f0;
`;

const Label = styled.h3`
  margin: 0 0 0.5rem;
  color: #f8fafc;
  font-size: 0.9rem;
`;

const Value = styled.pre`
  max-height: 22rem;
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.82rem;
`;

export interface IRecipeDemoOutputProps {
  label: string;
  value: unknown;
  error?: boolean;
}

export const RecipeDemoOutput: React.FC<IRecipeDemoOutputProps> = ({
  label,
  value,
  error = false,
}) => (
  <Root aria-live="polite" role={error ? 'alert' : 'status'}>
    <Label>{label}</Label>
    <Value>
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </Value>
  </Root>
);
