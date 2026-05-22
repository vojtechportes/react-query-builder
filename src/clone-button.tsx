import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';
import { getCloneButtonTitle } from './utils/get-clone-button-title.util';

export interface ICloneButtonProps {
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}

const StyledCloneButton = styled.button<{
  $theme: Required<IThemeProps>;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2rem;
  padding: 0 0.625rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  border-radius: 4px;
  outline: none;
  background-color: ${({ $theme }) => $theme.colors.white};
  color: ${({ $theme }) => $theme.colors.grey['600']};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    border-color: ${({ $theme }) => $theme.colors.grey['400']};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ $theme }) => $theme.colors.primary.light};
  }

  ${({ $disabled, $theme }) =>
    $disabled &&
    css`
      background-color: ${$theme.colors.white};
      border-color: ${$theme.colors.grey['200']};
      color: ${$theme.colors.grey['400']};
      opacity: 1;
    `}
`;

const CloneIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

export const CloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }

    onClick?.();
  }, [disabled, onClick]);

  const resolvedTitle = title || getCloneButtonTitle(undefined, nodeType);

  return (
    <StyledCloneButton
      type="button"
      onClick={handleClick}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      $disabled={disabled}
      $theme={theme}
    >
      <CloneIcon />
    </StyledCloneButton>
  );
};
