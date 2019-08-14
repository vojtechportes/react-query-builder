import React from 'react';
import styled from 'styled-components';
import { colors } from '../constants/colors';

const StyledButton = styled.button`
  color: #fff;
  border: 0;
  background-color: ${colors.primary};
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 3px;
  outline: none;
`;

export interface ButtonProps {
  onClick: () => void;
  className?: string;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  label,
}) => (
  <StyledButton onClick={onClick} className={className}>
    {label}
  </StyledButton>
);
