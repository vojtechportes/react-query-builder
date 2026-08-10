import React, { FC } from 'react';
import { ITextSkeletonProps } from '../../types';
import { resolveSize } from '../../utils/resolve-size.util';
import styles from './text.module.css';
import clsx from 'clsx';

export const Text: FC<Omit<ITextSkeletonProps, 'variant'>> = ({
  rows = 3,
  height,
  className,
}) => {
  const resolvedSize = height ? resolveSize(height) : undefined;

  return (
    <div className={clsx(className, styles.text)} style={{ gap: resolvedSize }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          className={clsx(styles.item)}
          key={i}
          style={{
            height: resolvedSize,
            width: i === rows - 1 && rows > 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};
