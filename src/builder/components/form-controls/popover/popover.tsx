import React, { FC } from 'react';
import styles from './popover.module.css';

export interface IPopoverProps {
  children: React.ReactNode;
}

export const Popover: FC<IPopoverProps> = ({ children }) => {
  return (
    <div
      data-test="SelectMultiPopover"
      role="listbox"
      className={styles.popover}
    >
      {children}
    </div>
  );
};
