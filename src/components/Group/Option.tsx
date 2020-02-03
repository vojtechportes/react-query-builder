import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../constants/colors';

interface StyledOptionProps {
  isSelected: boolean;
  disabled: boolean;
}

const StyledOption = styled.div<StyledOptionProps>`
  padding: 0.5rem 0.6rem;
  color: #fff;
  font-weight: bold;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: ${({ isSelected }) =>
    !!isSelected ? colors.primary : colors.darker};
  border: 1px solid ${colors.dark};
  cursor: pointer;

  ${({ disabled, isSelected }) =>
    disabled &&
    css`
      background: ${!!isSelected ? colors.dark : colors.darker};
      cursor: initial;
    `}
`;

export interface OptionProps {
  children: React.ReactNode | React.ReactNodeArray;
  value: any;
  onClick: (value: any) => void;
  disabled: boolean;
  isSelected: boolean;
  className?: string;
}

export const Option: React.FC<OptionProps> = ({
  children,
  onClick,
  disabled,
  value,
  isSelected,
  className,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <StyledOption
      className={className}
      isSelected={isSelected}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </StyledOption>
  );
};
