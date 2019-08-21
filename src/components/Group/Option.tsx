import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

interface StyledOptionProps {
  isSelected: boolean;
}

const StyledOption = styled.div<StyledOptionProps>`
  padding: 0.5rem 0.6rem;
  font-weight: bold;
  font-size: 0.7rem;
  color: #fff;
  text-transform: uppercase;
  background: ${({ isSelected }) =>
    !!isSelected ? colors.primary : colors.darker};
  cursor: pointer;
  border: 1px solid ${colors.dark};
  /* box-shadow: ${({ isSelected }) => !!isSelected && `0px 0px 5px 0px rgba(0,0,0,0.4)`}; */
`;

export interface OptionProps {
  children: React.ReactNode | React.ReactNodeArray;
  value: any;
  onClick: (value: any) => void;
  isSelected: boolean;
  className?: string;
}

export const Option: React.FC<OptionProps> = ({
  children,
  onClick,
  value,
  isSelected,
  className,
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <StyledOption
      className={className}
      isSelected={isSelected}
      onClick={handleClick}
    >
      {children}
    </StyledOption>
  );
};
