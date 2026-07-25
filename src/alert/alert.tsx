import clsx from 'clsx';
import React, { FC } from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import { AlertIcon } from './components/alert-icon';
import styles from './alert.module.css';
import { AlertSeverity } from './types/alert-severity';
import { AlertVariant } from './types/alert-variant';

export interface IAlertProps {
  children?: React.ReactNode;
  className?: string;
  severity?: AlertSeverity;
  variant?: AlertVariant;
  'data-test'?: string;
}

export const Alert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  variant = 'outlined',
  'data-test': dataTest,
}) => {
  const themeCssVariables = useThemeCssVariables();

  return (
    <div
      className={clsx(
        styles.alert,
        styles[severity],
        styles[variant],
        className
      )}
      data-test={dataTest}
      style={themeCssVariables}
    >
      <AlertIcon severity={severity} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
