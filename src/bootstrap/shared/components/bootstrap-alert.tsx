import React, { FC } from 'react';
import { AlertSeverity, AlertVariant, IAlertProps } from '../../../alert';
import { joinClassNames } from './styles';

const severityClassMap: Record<AlertSeverity, string> = {
  error: 'danger',
  info: 'info',
  success: 'success',
  warning: 'warning',
};

const getVariantClassName = (severity: AlertSeverity, variant: AlertVariant) =>
  variant === 'filled'
    ? `text-bg-${severityClassMap[severity]} border-0`
    : `alert-${severityClassMap[severity]}`;

export const BootstrapAlert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  variant = 'outlined',
  'data-test': dataTest,
}) => (
  <div
    className={joinClassNames('alert mb-0', getVariantClassName(severity, variant), className)}
    role="alert"
    data-test={dataTest}
  >
    {children}
  </div>
);
