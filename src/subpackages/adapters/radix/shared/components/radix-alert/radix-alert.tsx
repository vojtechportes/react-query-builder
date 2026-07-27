import clsx from 'clsx';
import React, { FC } from 'react';
import { IAlertProps } from '../../../../../../builder/components/alert';
import styles from './radix-alert.module.css';

export const RadixAlert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  'data-test': dataTest,
}) => (
  <div
    className={clsx(styles.alert, styles[severity], className)}
    data-test={dataTest}
  >
    {children}
  </div>
);
