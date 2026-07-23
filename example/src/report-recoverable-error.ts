import type { ErrorInfo } from 'react';

export const reportRecoverableError = (
  error: unknown,
  errorInfo: ErrorInfo
): void => {
  console.error(error, errorInfo.componentStack);
};
