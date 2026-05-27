import React, { FC } from 'react';
import MuiAlert from '@mui/material/Alert';
import { IAlertProps } from '../../../alert';

const severityMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

export const MuiAlertComponent: FC<IAlertProps> = ({
  children,
  className,
  severity = 'warning',
  variant = 'outlined',
  'data-test': dataTest,
}) => (
  <MuiAlert
    severity={severityMap[severity]}
    variant={variant}
    className={className}
    data-test={dataTest}
  >
    {children}
  </MuiAlert>
);
