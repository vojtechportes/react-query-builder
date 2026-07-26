import clsx from 'clsx';
import React, { FC } from 'react';
import styles from './rule-container.module.css';

export interface IRuleProps {
  children: React.ReactNode;
  controls: React.ReactNode;
  dragHandle?: React.ReactNode;
  className?: string;
  'data-test'?: string;
}

export const Rule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasDragHandle = Boolean(dragHandle);
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <div
      className={clsx(
        styles.rule,
        hasDragHandle && styles.withDragHandle,
        hasControls && styles.withControls,
        className
      )}
      data-rule-has-drag-handle={hasDragHandle}
      data-rule-has-controls={hasControls}
      data-test={dataTest}
    >
      {dragHandle}
      <div
        className={clsx(
          styles.content,
          !hasControls && styles.contentWithoutControls
        )}
      >
        {children}
      </div>
      {hasControls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  );
};
