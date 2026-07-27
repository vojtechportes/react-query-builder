import clsx from 'clsx';
import React, { FC } from 'react';
import { IRuleProps } from '../../../../builder/components/rule/rule-container';
import styles from './radix-rule.module.css';

export const RadixRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasControls = React.Children.toArray(controls).length > 0;
  const hasDragHandle = Boolean(dragHandle);

  return (
    <div
      className={clsx(
        styles.rule,
        hasControls && styles.withControls,
        hasDragHandle && styles.withDragHandle,
        className
      )}
      data-test={dataTest}
    >
      {dragHandle}
      <div
        className={clsx(
          styles.body,
          !hasControls && styles.bodyWithoutControls
        )}
      >
        {children}
      </div>
      {hasControls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  );
};
