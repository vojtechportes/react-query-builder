import clsx from 'clsx';
import React, { FC } from 'react';
import styles from './text.module.css';

export interface ITextProps {
  children?: React.ReactNode;
  className?: string;
}

export const Text: FC<ITextProps> = ({ children, className }) => (
  <span className={clsx(styles.text, className)}>{children}</span>
);
