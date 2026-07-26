import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './root-controls.module.css';

export const RootControls = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.rootControls, className)} {...props} />
));

RootControls.displayName = 'RootControls';
