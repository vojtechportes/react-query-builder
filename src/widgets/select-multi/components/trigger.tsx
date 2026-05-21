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
  min-width: 0;
  line-height: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSummaryBadge = styled.span<{ $theme: Required<IThemeProps> }>`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  max-width: 4rem;
  margin-right: 0.35rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: ${({ $theme }) => $theme.colors.primary.default};
  color: ${({ $theme }) => $theme.colors.primary.contrastText};
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
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
  badgeContent?: string;
  disabled: boolean;
  expanded: boolean;
  id?: string;
  label: string;
  onClick: () => void;
  title?: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  theme: Required<IThemeProps>;
}

export const Trigger: FC<ITriggerProps> = ({
  badgeContent,
  disabled,
  expanded,
  id,
  label,
  onClick,
  title,
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
      title={title}
      $theme={theme}
    >
      <StyledLabel>{label}</StyledLabel>
      {badgeContent ? (
        <StyledSummaryBadge data-test="SelectMultiSummaryBadge" $theme={theme}>
          {badgeContent}
        </StyledSummaryBadge>
      ) : null}
      <StyledChevron $theme={theme} />
    </StyledTrigger>
  );
};
