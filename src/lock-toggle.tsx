import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';
import {
  BuilderLockState,
  getNextGroupLockState,
  getNextRuleLockState,
} from './utils/lock-state';
import { getLockToggleTitle } from './utils/get-lock-toggle-title.util';

export interface ILockToggleProps {
  state: BuilderLockState;
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onChange?: (nextState: BuilderLockState) => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}

const stateStyles = {
  unlocked: css<{ $theme: Required<IThemeProps> }>`
    background-color: ${({ $theme }) => $theme.colors.white};
    border-color: ${({ $theme }) => $theme.colors.grey['300']};
    color: ${({ $theme }) => $theme.colors.grey['600']};

    &:hover {
      background-color: ${({ $theme }) => $theme.colors.grey['100']};
      border-color: ${({ $theme }) => $theme.colors.grey['400']};
    }
  `,
  self: css<{ $theme: Required<IThemeProps> }>`
    background-color: ${({ $theme }) => $theme.colors.white};
    border-color: ${({ $theme }) => $theme.colors.primary.default};
    color: ${({ $theme }) => $theme.colors.primary.default};

    &:hover {
      background-color: ${({ $theme }) => $theme.colors.grey['100']};
      border-color: ${({ $theme }) => $theme.colors.primary.dark};
      color: ${({ $theme }) => $theme.colors.primary.dark};
    }
  `,
  all: css<{ $theme: Required<IThemeProps> }>`
    background-color: ${({ $theme }) => $theme.colors.white};
    border-color: ${({ $theme }) => $theme.colors.primary.default};
    color: ${({ $theme }) => $theme.colors.primary.dark};

    &:hover {
      background-color: ${({ $theme }) => $theme.colors.grey['100']};
      border-color: ${({ $theme }) => $theme.colors.primary.dark};
      color: ${({ $theme }) => $theme.colors.primary.dark};
    }
  `,
};

const StyledLockToggle = styled.button<{
  $state: BuilderLockState;
  $theme: Required<IThemeProps>;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2rem;
  padding: 0 0.625rem;
  border: 1px solid;
  border-radius: 4px;
  outline: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  ${({ $state }) => stateStyles[$state]}

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

const LockIcon: FC<{ state: BuilderLockState }> = ({ state }) => {
  if (state === 'unlocked') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z"
        />
      </svg>
    );
  }

  if (state === 'self') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
        />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
      />
    </svg>
  );
};

export const LockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (disabled || !onChange) {
      return;
    }

    onChange(
      nodeType === 'group'
        ? getNextGroupLockState(state)
        : getNextRuleLockState(state)
    );
  }, [disabled, nodeType, onChange, state]);

  const resolvedTitle =
    title || getLockToggleTitle(undefined, nodeType, state);

  return (
    <StyledLockToggle
      type="button"
      onClick={handleClick}
      className={className}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
      $state={state}
      $disabled={disabled}
      $theme={theme}
    >
      <LockIcon state={state} />
    </StyledLockToggle>
  );
};
