import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../../theme-provider/theme-provider';
import { RemoveIcon } from './remove-icon';

const StyledTag = styled.span<{ $theme: Required<IThemeProps> }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.3rem 0.2rem 0.55rem;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['400']};
  border-radius: 999px;
  background: ${({ $theme }) => $theme.colors.white};
  color: ${({ $theme }) => $theme.colors.grey['900']};
  font-size: 0.8rem;
`;

const StyledLabel = styled.span`
  line-height: 1.2;
`;

const StyledRemoveButton = styled.button<{ $theme: Required<IThemeProps> }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${({ $theme }) => $theme.colors.grey['700']};
  cursor: pointer;

  &:hover {
    background: ${({ $theme }) => $theme.colors.grey['200']};
    color: ${({ $theme }) => $theme.colors.grey['900']};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export interface ITagProps {
  disabled: boolean;
  label: string;
  value: string;
  onRemove: (value: string) => void;
  theme: Required<IThemeProps>;
}

export const Tag: FC<ITagProps> = ({
  disabled,
  label,
  value,
  onRemove,
  theme,
}) => {
  return (
    <StyledTag data-test="SelectMultiTag" $theme={theme}>
      <StyledLabel>{label}</StyledLabel>
      <StyledRemoveButton
        type="button"
        data-test="Delete"
        aria-label={`Remove ${label}`}
        disabled={disabled}
        onClick={() => onRemove(value)}
        $theme={theme}
      >
        <RemoveIcon />
      </StyledRemoveButton>
    </StyledTag>
  );
};
