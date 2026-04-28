import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';
import { useTheme } from '../theme-provider/hooks/use-theme';

const Knob = styled.div<{ $theme: Required<IThemeProps> }>`
  position: absolute;
  width: 1.3rem;
  height: 1.3rem;
  background: white;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 50%;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.4);
`;

const StyledSwitch = styled.div<{
  switched: boolean;
  disabled: boolean;
  $theme: Required<IThemeProps>;
}>`
  position: relative;
  width: 3rem;
  height: 1.65rem;
  background-color: ${({ switched, $theme }) =>
    switched ? $theme.colors.primary.default : $theme.colors.grey['300']};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['500']};
  border-radius: 1.4rem;
  cursor: pointer;
  transition: all 0.5s;

  ${({ disabled, $theme }) =>
    disabled &&
    css`
      background-color: ${$theme.colors.grey['200']};
      cursor: initial;

      ${Knob} {
        background: ${$theme.colors.grey['300']};
      }
    `}

  ${Knob} {
    top: 0.1rem;
    left: ${({ switched }) => (switched ? '1.3rem' : '0.1rem')};
    transition: all 0.5s;
  }
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
      switched={switched}
      disabled={disabled}
      onClick={handleClick}
      className={className}
      $theme={theme}
    >
      <Knob $theme={theme} />
    </StyledSwitch>
  );
};
