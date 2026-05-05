import React, { ButtonHTMLAttributes, FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../../src';

const StyledButton = styled.button`
  width: fit-content;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
  color: ${colors.white};
  background: ${colors.primary.default};
  border: 1px solid ${colors.primary.default};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${colors.primary.dark};
    border-color: ${colors.primary.dark};
  }
`;

export interface ISmallButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SmallButton: FC<ISmallButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <StyledButton type="button" {...props}>
      {children}
    </StyledButton>
  );
};
