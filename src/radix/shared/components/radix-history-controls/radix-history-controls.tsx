import clsx from 'clsx';
import React, { FC } from 'react';
import { IHistoryControlsProps } from '../../../../builder';
import styles from './radix-history-controls.module.css';

export const RadixHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <div className={clsx(styles.controls, className)}>
    {undoButton}
    {redoButton}
  </div>
);
