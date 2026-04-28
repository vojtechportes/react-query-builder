import React from 'react';
import styled from 'styled-components';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';

const StyledDragHandle = styled.div<{ $theme: Required<IThemeProps> }>`
  width: 14px;
  min-width: 14px;
  height: 100%;
  background: ${({ $theme }) => $theme.colors.grey['300']};
  border-right: ${({ $theme }) => $theme.colors.grey['400']};
  cursor: grab;
  touch-action: none;
`;

export const DragHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const theme = useTheme();

  return (
    <StyledDragHandle
      ref={ref}
      data-test="DragHandle"
      $theme={theme}
      {...props}
    />
  );
});
