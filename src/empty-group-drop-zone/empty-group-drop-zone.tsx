import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './empty-group-drop-zone.module.css';

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
  const themeCssVariables = useThemeCssVariables();
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
      <div
        ref={setNodeRef}
        className={clsx(styles.hitArea, {
          [styles.dragging]: isDragging,
        })}
      />
      <div
        className={clsx(styles.placeholder, {
          [styles.active]: isActive,
          [styles.dragging]: isDragging,
          [styles.transitionDisabled]: disableTransition,
        })}
        data-testid={isActive ? 'ActiveDropZone' : undefined}
      >
        <div
          style={themeCssVariables}
          className={clsx(styles.placeholderInner, {
            [styles.active]: isActive,
            [styles.transitionDisabled]: disableTransition,
          })}
        />
      </div>
    </>
  );
};
