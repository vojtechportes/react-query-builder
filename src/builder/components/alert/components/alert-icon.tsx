import React, { FC } from 'react';
import styles from '../alert.module.css';
import { AlertSeverity } from '../types/alert-severity';

export const AlertIcon: FC<{ severity: AlertSeverity }> = ({ severity }) => {
  if (severity === 'success') {
    return (
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.1 14.3-4.2-4.2 1.4-1.4 2.8 2.8 5.7-5.7 1.4 1.4Z" />
        </svg>
      </span>
    );
  }

  if (severity === 'error') {
    return (
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
        </svg>
      </span>
    );
  }

  if (severity === 'info') {
    return (
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className={styles.icon} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M1 21h22L12 2Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z" />
      </svg>
    </span>
  );
};
