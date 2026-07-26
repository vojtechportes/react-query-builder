import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './styled-builder.module.css';

export const StyledBuilder = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.builder, className)} {...props} />
));

StyledBuilder.displayName = 'StyledBuilder';
