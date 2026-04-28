import React, { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import styled from 'styled-components';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';

const HitArea = styled.div<{ isDragging: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: ${({ isDragging }) => (isDragging ? 'auto' : 'none')};
`;

const Placeholder = styled.div<{
  isActive: boolean;
  isDragging: boolean;
  disableTransition: boolean;
}>`
  position: relative;
  z-index: 0;
  width: 100%;
  box-sizing: border-box;
  height: ${({ isActive, isDragging }) =>
    isActive && isDragging ? '50px' : '0'};
  margin: ${({ isActive, isDragging }) =>
    isActive && isDragging ? '8px 0 0' : '0'};
  opacity: ${({ isActive, isDragging }) => (isActive && isDragging ? 1 : 0)};
  overflow: hidden;
  transition: ${({ disableTransition }) =>
    disableTransition
      ? 'none'
      : 'height 180ms ease, margin 180ms ease, opacity 180ms ease'};
`;

const PlaceholderInner = styled.div<{
  isActive: boolean;
  disableTransition: boolean;
  $theme: Required<IThemeProps>;
}>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px dashed
    ${({ isActive, $theme }) =>
      isActive ? $theme.colors.grey['500'] : 'transparent'};
  background: ${({ isActive }) =>
    isActive ? 'rgba(204, 204, 204, 0.08)' : 'transparent'};
  transition: ${({ disableTransition }) =>
    disableTransition
      ? 'none'
      : 'border-color 180ms ease, background-color 180ms ease'};
`;

export interface IEmptyGroupDropZoneProps {
  id: string;
  index: number;
  parentId: string;
  isActive: boolean;
  isDragging: boolean;
  disableTransition?: boolean;
}

export const EmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = ({
  id,
  index,
  parentId,
  isActive,
  isDragging,
  disableTransition = false,
}) => {
  const theme = useTheme();

  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'drop-zone',
      index,
      parentId,
      isEmpty: true,
    },
  });

  return (
    <>
      <HitArea ref={setNodeRef} isDragging={isDragging} />
      <Placeholder
        isActive={isActive}
        isDragging={isDragging}
        disableTransition={disableTransition}
        data-testid={isActive ? 'ActiveDropZone' : undefined}
      >
        <PlaceholderInner
          isActive={isActive}
          disableTransition={disableTransition}
          $theme={theme}
        />
      </Placeholder>
    </>
  );
};
