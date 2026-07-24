import * as React from 'react';
import styled from 'styled-components';
import { recipeDemoButtonStyles } from '../styles/recipe-demo-button.styles';

const Root = styled.div<{ $direction: 'column' | 'row' }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  flex-wrap: ${({ $direction }) => ($direction === 'row' ? 'wrap' : 'nowrap')};
  align-items: ${({ $direction }) =>
    $direction === 'row' ? 'center' : 'stretch'};
  gap: 0.5rem;
  min-width: 0;

  > form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  > p {
    margin: 0;
  }

  > label {
    font-weight: 600;
  }

  > input:not([type='checkbox']),
  > select,
  > textarea {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid #94a3b8;
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
    font: inherit;
  }

  > textarea {
    min-height: 6rem;
    resize: vertical;
  }

  > input:not([type='checkbox']):focus,
  > select:focus,
  > textarea:focus {
    outline: 3px solid rgba(59, 130, 246, 0.25);
    outline-offset: 1px;
    border-color: #3b82f6;
  }

  > button {
    ${recipeDemoButtonStyles}
  }
`;

export interface IRecipeDemoGroupProps {
  children: React.ReactNode;
  direction?: 'column' | 'row';
}

export const RecipeDemoGroup: React.FC<IRecipeDemoGroupProps> = ({
  children,
  direction = 'column',
}) => <Root $direction={direction}>{children}</Root>;
