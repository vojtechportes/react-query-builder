import clsx from 'clsx';
import React from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './drag-handle.module.css';

export const DragHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const themeCssVariables = useThemeCssVariables();

  return (
    <div
      ref={ref}
      data-test="DragHandle"
      style={{ ...themeCssVariables, ...style }}
      className={clsx(styles.dragHandle, className)}
      {...props}
    />
  );
});
