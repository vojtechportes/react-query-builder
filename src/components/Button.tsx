import React from 'react';
import styled from 'styled-components';
import { colors } from '../constants/colors';

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  color: #fff;
  font-size: 0.7rem;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: ${colors.primary};
  border: 0;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
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
