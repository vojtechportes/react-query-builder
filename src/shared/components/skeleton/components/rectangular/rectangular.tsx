import React, { FC } from 'react';
import { resolveSize } from '../../utils/resolve-size.util';
import { IRectangularSkeletonProps } from '../../types';
import styles from './rectangular.module.css';
import clsx from 'clsx';

export const Rectangular: FC<Omit<IRectangularSkeletonProps, 'variant'>> = ({
  width,
  height,
  className,
}) => {
  const resolvedWidth = width ? resolveSize(width) : undefined;
  const resolvedHeight = height ? resolveSize(height) : undefined;

  return (
    <div
      className={clsx(className, styles.rectangular)}
      style={{ width: resolvedWidth, height: resolvedHeight }}
    />
  );
};
