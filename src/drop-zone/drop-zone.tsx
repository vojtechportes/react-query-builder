import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './drop-zone.module.css';

export interface IDropZoneProps {
  id: string;
  index: number;
  parentId?: string;
  isActive: boolean;
  isDragging: boolean;
  isEmpty?: boolean;
  disableTransition?: boolean;
  className?: string;
}

export const DropZone: FC<IDropZoneProps> = ({
  id,
  index,
  parentId,
  isActive,
  isDragging,
  isEmpty = false,
  disableTransition = false,
  className,
}) => {
  const themeCssVariables = useThemeCssVariables();
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
    <div
      ref={setNodeRef}
      style={themeCssVariables}
      className={clsx(styles.anchor, className, {
        [styles.active]: isActive,
        [styles.dragging]: isDragging,
        [styles.empty]: isEmpty,
        [styles.transitionDisabled]: disableTransition,
      })}
      data-test={isActive ? 'ActiveDropZone' : undefined}
    >
      <div
        className={clsx(styles.dropZone, {
          [styles.dragging]: isDragging,
          [styles.transitionDisabled]: disableTransition,
        })}
      >
        <div
          className={clsx(styles.inner, {
            [styles.active]: isActive,
            [styles.empty]: isEmpty,
            [styles.transitionDisabled]: disableTransition,
          })}
        />
      </div>
    </div>
  );
};
