import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { RadixAlert } from './radix-alert';
import styles from './radix-alert.module.css';

describe('#radix/components/RadixAlert', () => {
  it.each(['error', 'success', 'info', 'warning'] as const)(
    'maps %s severity to a scoped class',
    (severity) => {
      const { container } = render(
        <RadixAlert
          severity={severity}
          className="incoming-alert"
          data-test="Alert"
        >
          Message
        </RadixAlert>
      );
      const alert = container.firstElementChild as HTMLElement;

      expect(alert).toHaveClass(
        styles.alert,
        styles[severity],
        'incoming-alert'
      );
      expect(alert).toHaveAttribute('data-test', 'Alert');
    }
  );
});
