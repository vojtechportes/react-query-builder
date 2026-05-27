import React, { FC } from 'react';
import { Alert } from 'antd';
import { IAlertProps } from '../../../alert';

const severityMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

export const AntdAlert: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  'data-test': dataTest,
}) => (
  <Alert
    type={severityMap[severity]}
    title={children}
    showIcon
    className={className}
    data-test={dataTest}
  />
);
