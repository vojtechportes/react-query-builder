import clsx from 'clsx';
import React, { FC } from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './text.module.css';

export interface ITextProps {
  children?: React.ReactNode;
  className?: string;
}

export const Text: FC<ITextProps> = ({ children, className }) => {
  const themeCssVariables = useThemeCssVariables();

  return (
    <span className={clsx(styles.text, className)} style={themeCssVariables}>
      {children}
    </span>
  );
};
