import clsx from 'clsx';
import React, { FC } from 'react';
import styles from './popover-item.module.css';

export interface IPopoverItemProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  'data-test'?: string;
}

export const PopoverItem: FC<IPopoverItemProps> = ({
  label,
  onClick,
  disabled = false,
  className,
  'data-test': dataTest,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || undefined}
    className={clsx(styles.item, className)}
    data-test={dataTest}
  >
    {label}
  </button>
);
