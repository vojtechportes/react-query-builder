import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './styled-builder.module.css';

export interface IStyledBuilderProps extends ComponentPropsWithoutRef<'div'> {
  useDefaultStyles?: boolean;
}

export const StyledBuilder = forwardRef<HTMLDivElement, IStyledBuilderProps>(
  ({ className, useDefaultStyles = true, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        styles.builder,
        useDefaultStyles && styles.container,
        className
      )}
      {...props}
    />
  )
);

StyledBuilder.displayName = 'StyledBuilder';
