import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { IThemeProps } from '../../../theme-provider/theme-provider';
import { CheckIcon } from './check-icon';

const StyledOption = styled.button<{
  $selected: boolean;
  $theme: Required<IThemeProps>;
}>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 0;
  background: ${({ $theme }) => $theme.colors.white};
  color: ${({ $theme }) => $theme.colors.grey['900']};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    background: ${({ $theme }) => $theme.colors.grey['100']};
  }

  &:focus-visible {
    outline: none;
    background: ${({ $theme }) => $theme.colors.grey['100']};
  }

  ${({ $selected, $theme }) =>
    $selected &&
    css`
      background: ${$theme.colors.grey['100']};
      box-shadow: inset 3px 0 0 ${$theme.colors.primary.default};
      color: ${$theme.colors.primary.dark};

      &:hover,
      &:focus-visible {
        background: ${$theme.colors.grey['200']};
      }
    `}
`;

const StyledLabel = styled.span`
  white-space: nowrap;
`;

const StyledIndicator = styled.span<{ $selected: boolean; $theme: Required<IThemeProps> }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $selected, $theme }) =>
    $selected ? $theme.colors.primary.default : $theme.colors.grey['500']};
`;

export interface IOptionProps {
  label: string;
  selected: boolean;
  value: string;
  onClick: (value: string) => void;
  theme: Required<IThemeProps>;
}

export const Option: FC<IOptionProps> = ({
  label,
  selected,
  value,
  onClick,
  theme,
}) => {
  return (
    <StyledOption
      type="button"
      data-test={`SelectMultiOption[${value}]`}
      role="option"
      aria-selected={selected}
      $selected={selected}
      $theme={theme}
      onClick={() => onClick(value)}
    >
      <StyledLabel>{label}</StyledLabel>
      <StyledIndicator $selected={selected} $theme={theme}>
        {selected ? <CheckIcon /> : null}
      </StyledIndicator>
    </StyledOption>
  );
};
