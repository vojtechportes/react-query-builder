import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../theme-provider/theme-provider';

const StyledPopover = styled.div<{ $theme: Required<IThemeProps> }>`
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: 10;
  min-width: 100%;
  width: max-content;
  max-width: min(420px, calc(100vw - 2rem));
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  border-radius: 6px;
  background: ${({ $theme }) => $theme.colors.white};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
`;

export interface IPopoverProps {
  children: React.ReactNode;
  theme: Required<IThemeProps>;
}

export const Popover: FC<IPopoverProps> = ({ children, theme }) => {
  return (
    <StyledPopover data-test="SelectMultiPopover" role="listbox" $theme={theme}>
      {children}
    </StyledPopover>
  );
};
