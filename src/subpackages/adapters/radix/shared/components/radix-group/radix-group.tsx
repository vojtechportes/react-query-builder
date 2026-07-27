import clsx from 'clsx';
import React, { FC } from 'react';
import { IGroupProps } from '../../../../../../builder/components/group/components/group-container';
import styles from './radix-group.module.css';

export const RadixGroup: FC<IGroupProps> = ({
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
    >
      {dragHandle}
      <div className={styles.body}>
        {hasHeader ? (
          <div className={styles.header}>
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
