import clsx from 'clsx';
import React, { FC } from 'react';
import { IHistoryControlsProps } from '../../../types';
import styles from './history-controls.module.css';

export const HistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <div className={clsx(styles.historyControls, className)}>
    {undoButton}
    {redoButton}
  </div>
);
