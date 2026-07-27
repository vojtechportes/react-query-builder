import clsx from 'clsx';
import React from 'react';
import styles from './drag-handle.module.css';

export const DragHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-test="DragHandle"
    style={style}
    className={clsx(styles.dragHandle, className)}
    {...props}
  />
));
