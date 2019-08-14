import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';

interface StyledOptionProps {
  isSelected: boolean;
}

const StyledOption = styled.div<StyledOptionProps>`
  padding: 0.3rem 0.4rem;
  font-weight: bold;
  font-size: 0.7rem;
  color: #fff;
  background: ${({ isSelected }) =>
    !!isSelected ? colors.enabled : colors.disabled};
  cursor: pointer;
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
