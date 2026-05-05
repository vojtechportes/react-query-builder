import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const KNOB_OFFSET = '1.15rem';

const Knob = styled.span<{
  $theme: Required<IThemeProps>;
  $switched: boolean;
}>`
  display: block;
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 1.2rem;
  height: 1.2rem;
  background: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transform: translateX(${({ $switched }) => ($switched ? KNOB_OFFSET : '0')});
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
`;

const StyledSwitch = styled.button<{
  $switched: boolean;
  $disabled: boolean;
  $theme: Required<IThemeProps>;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 2.75rem;
  height: 1.6rem;
  padding: 0.15rem;
  margin: 0;
  border: 1px solid
    ${({ $switched, $theme }) =>
      $switched ? $theme.colors.primary.default : $theme.colors.grey['500']};
  background-color: ${({ $switched, $theme }) =>
    $switched ? $theme.colors.primary.default : $theme.colors.grey['300']};
  border-radius: 999px;
  appearance: none;
  outline: none;
  font-size: 0;
  line-height: 0;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ $theme }) => $theme.colors.primary.light};
  }

  ${({ $disabled, $theme }) =>
    $disabled &&
    css`
      background-color: ${$theme.colors.grey['200']};
      border-color: ${$theme.colors.grey['400']};
      cursor: not-allowed;
      opacity: 0.8;

      ${Knob} {
        background: ${$theme.colors.grey['300']};
        border-color: ${$theme.colors.grey['400']};
      }
    `}
`;

export interface ISwitchProps {
  switched: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (onChange && !disabled) {
      onChange(!switched);
    }
  }, [disabled, onChange, switched]);

  return (
    <StyledSwitch
      data-test="Switch"
      type="button"
      role="switch"
      aria-checked={switched}
      aria-disabled={disabled}
      $switched={switched}
      $disabled={disabled}
      onClick={handleClick}
      className={className}
      $theme={theme}
    >
      <Knob $theme={theme} $switched={switched} />
    </StyledSwitch>
  );
};
