import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './text-mode-blocked-alert-container.module.css';

export const TextModeBlockedAlertContainer = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.container, className)} {...props} />
));

TextModeBlockedAlertContainer.displayName = 'TextModeBlockedAlertContainer';
