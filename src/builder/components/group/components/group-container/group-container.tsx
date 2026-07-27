import clsx from 'clsx';
import React, { FC } from 'react';
import styles from './group-container.module.css';

export interface IGroupProps {
  controlsLeft?: React.ReactNode;
  controlsRight?: React.ReactNode;
  children: React.ReactNode;
  dragHandle?: React.ReactNode;
  className?: string;
  contentOverlay?: React.ReactNode;
}

export const Group: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const hasDragHandle = Boolean(dragHandle);
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <div
      className={clsx(
        styles.group,
        hasDragHandle && styles.withDragHandle,
        className
      )}
      data-group-has-drag-handle={hasDragHandle}
      data-group-has-header={hasHeader}
    >
      {dragHandle}
      <div className={styles.body}>
        {hasHeader ? (
          <div
            className={clsx(
              styles.header,
              hasControlsLeft && styles.withLeftControls,
              hasControlsRight && styles.withRightControls
            )}
            data-group-controls-left={hasControlsLeft}
            data-group-controls-right={hasControlsRight}
          >
            {hasControlsLeft ? (
              <div className={styles.left}>{controlsLeft}</div>
            ) : null}
            {hasControlsRight ? (
              <div className={styles.right}>{controlsRight}</div>
            ) : null}
          </div>
        ) : null}
        {contentOverlay}
        {children}
      </div>
    </div>
  );
};
