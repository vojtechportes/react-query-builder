import React, { FC } from 'react';
import { resolveSize } from '../../utils/resolve-size.util';
import { ICircularSkeletonProps } from '../../types';
import styles from './circular.module.css';
import clsx from 'clsx';

export const Circular: FC<Omit<ICircularSkeletonProps, 'variant'>> = ({
  width,
  className,
}) => {
  const resolvedWidth = width ? resolveSize(width) : undefined;

  return (
    <div
      className={clsx(className, styles.circular)}
      style={{ width: resolvedWidth }}
    />
  );
};
