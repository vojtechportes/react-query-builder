import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../../theme-provider/theme-provider';
import { inputControlStyles } from '../../../styles/input.styles';

const StyledTrigger = styled.button<{ $theme: Required<IThemeProps> }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  ${inputControlStyles}
  padding: 0 2.2rem 0 0.6rem;
  text-align: left;
  cursor: pointer;
`;

const StyledLabel = styled.span`
  display: block;
  flex: 1 1 auto;
  line-height: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledChevron = styled.span<{ $theme: Required<IThemeProps> }>`
  position: absolute;
  top: 50%;
  right: 0.7rem;
  width: 0.55rem;
  height: 0.35rem;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  transform: translateY(-50%);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0.08rem;
    width: 0.38rem;
    height: 1px;
    background: currentColor;
  }

  &::before {
    left: 0;
    transform: rotate(45deg);
    transform-origin: left center;
  }

  &::after {
    right: 0;
    transform: rotate(-45deg);
    transform-origin: right center;
  }
`;

export interface ITriggerProps {
  disabled: boolean;
  expanded: boolean;
  id?: string;
  label: string;
  onClick: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  theme: Required<IThemeProps>;
}

export const Trigger: FC<ITriggerProps> = ({
  disabled,
  expanded,
  id,
  label,
  onClick,
  triggerRef,
  theme,
}) => {
  return (
    <StyledTrigger
      ref={triggerRef}
      type="button"
      id={id}
      data-test="SelectMultiTrigger"
      aria-haspopup="listbox"
      aria-expanded={expanded}
      disabled={disabled}
      onClick={onClick}
      $theme={theme}
    >
      <StyledLabel>{label}</StyledLabel>
      <StyledChevron $theme={theme} />
    </StyledTrigger>
  );
};
