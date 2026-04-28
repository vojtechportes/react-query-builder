import React, { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import styled, { css } from 'styled-components';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';

interface IDropZoneAnchorProps {
  isDragging: boolean;
  isEmpty: boolean;
  isActive: boolean;
  disableTransition: boolean;
}

const DropZoneAnchor = styled.div<IDropZoneAnchorProps>`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  transition: ${({ disableTransition }) =>
    disableTransition
      ? 'none'
      : 'height 180ms ease, margin 180ms ease, border-color 180ms ease, background-color 180ms ease, opacity 180ms ease'};

  ${({ isDragging }) =>
    !isDragging &&
    css`
      opacity: 0;
    `}

  ${({ isEmpty }) =>
    !isEmpty &&
    css`
      height: 0;
      margin: 0;
      border: 0;
    `}

  ${({ isDragging, isEmpty, isActive }) =>
    isDragging &&
    !isEmpty &&
    css`
      height: ${isActive ? '50px' : '0px'};
      margin: ${isActive ? '0.5rem 0 0' : '0'};
      opacity: ${isActive ? 1 : 0.45};
    `}

  ${({ isDragging, isEmpty, isActive }) =>
    isEmpty &&
    css`
      height: 50px;
      margin: 0.5rem 0 0;
      opacity: ${isDragging ? (isActive ? 1 : 0.45) : 0};
    `}
`;

interface IStyledDropZoneProps {
  isDragging: boolean;
  isEmpty: boolean;
  disableTransition: boolean;
}

const StyledDropZone = styled.div<IStyledDropZoneProps>`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  pointer-events: ${({ isDragging }) => (isDragging ? 'auto' : 'none')};
  transition: ${({ disableTransition }) =>
    disableTransition ? 'none' : 'opacity 180ms ease, transform 180ms ease'};
  opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
`;

interface IDropZoneInnerProps {
  isActive: boolean;
  isEmpty: boolean;
  disableTransition: boolean;
  $theme: Required<IThemeProps>;
}

const DropZoneInner = styled.div<IDropZoneInnerProps>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px dashed
    ${({ isActive, $theme }) =>
      isActive ? $theme.colors.grey['300'] : 'transparent'};
  background: ${({ isActive }) =>
    isActive ? 'rgba(204, 204, 204, 0.08)' : 'transparent'};
  transform: scaleY(
    ${({ isActive, isEmpty }) => (isActive || isEmpty ? 1 : 0.7)}
  );
  transform-origin: center;
  transition: ${({ disableTransition }) =>
    disableTransition
      ? 'none'
      : 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease, opacity 180ms ease'};
  opacity: ${({ isActive, isEmpty }) => (isActive || isEmpty ? 1 : 0.35)};
`;

export interface IDropZoneProps {
  id: string;
  index: number;
  parentId?: string;
  isActive: boolean;
  isDragging: boolean;
  isEmpty?: boolean;
  disableTransition?: boolean;
}

export const DropZone: FC<IDropZoneProps> = ({
  id,
  index,
  parentId,
  isActive,
  isDragging,
  isEmpty = false,
  disableTransition = false,
}) => {
  const theme = useTheme();

  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'drop-zone',
      index,
      parentId,
      isEmpty,
    },
  });

  return (
    <DropZoneAnchor
      ref={setNodeRef}
      isDragging={isDragging}
      isEmpty={isEmpty}
      isActive={isActive}
      disableTransition={disableTransition}
      data-test={isActive ? 'ActiveDropZone' : undefined}
    >
      <StyledDropZone
        isDragging={isDragging}
        isEmpty={isEmpty}
        disableTransition={disableTransition}
      >
        <DropZoneInner
          isActive={isActive}
          isEmpty={isEmpty}
          disableTransition={disableTransition}
          $theme={theme}
        />
      </StyledDropZone>
    </DropZoneAnchor>
  );
};
