import clsx from 'clsx';
import React, { FC } from 'react';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './button.module.css';

export interface IButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  'data-test'?: string;
  label?: string;
  children?: React.ReactNode;
}

export const Button: FC<IButtonProps> = ({
  onClick,
  disabled = false,
  className,
  title,
  children,
  label,
  'data-test': dataTest,
}) => {
  const themeCssVariables = useThemeCssVariables();

  return (
    <button
      onClick={onClick}
      disabled={disabled || undefined}
      className={clsx(styles.button, className)}
      title={title}
      data-test={dataTest}
      style={themeCssVariables}
    >
      {children || label}
    </button>
  );
};
