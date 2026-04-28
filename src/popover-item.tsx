import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';

const Item = styled.button<{ $theme: Required<IThemeProps> }>`
  width: 100%;
  padding: 0.65rem 0.85rem;
  color: ${({ $theme }) => $theme.colors.grey['700']};
  text-align: left;
  background: ${({ $theme }) => $theme.colors.white};
  border: 0;
  border-bottom: 1px solid ${({ $theme }) => $theme.colors.grey['100']};
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${({ $theme }) => $theme.colors.grey['500']};
  }
`;

export interface IPopoverItemProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  'data-test'?: string;
}

export const PopoverItem: FC<IPopoverItemProps> = ({
  label,
  onClick,
  className,
  'data-test': dataTest,
}) => {
  const theme = useTheme();

  return (
    <Item
      type="button"
      onClick={onClick}
      className={className}
      data-test={dataTest}
      $theme={theme}
    >
      {label}
    </Item>
  );
};
