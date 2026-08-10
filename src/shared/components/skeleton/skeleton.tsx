import React, { FC } from 'react';
import { ISkeletonProps } from './types';
import clsx from 'clsx';
import styles from './skeleton.module.css';
import { Text } from './components/text/text';
import { Rectangular } from './components/rectangular/rectangular';
import { Circular } from './components/circular/circular';

export const Skeleton: FC<ISkeletonProps> = (props) => {
  const { variant = 'rectangular', ...rest } = props;
  const className = clsx(styles.skeleton, rest.className);

  if (variant === 'text') {
    return <Text className={className} height={rest.height} rows={rest.rows} />;
  }

  if (variant === 'rectangular') {
    return (
      <Rectangular
        className={className}
        width={rest.width}
        height={rest.height}
      />
    );
  }

  if (variant === 'circular') {
    return <Circular className={className} width={rest.width} />;
  }

  return null;
};
