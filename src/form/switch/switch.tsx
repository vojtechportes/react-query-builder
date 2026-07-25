import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import { useThemeCssVariables } from '../../theme-provider/hooks/use-theme-css-variables';
import styles from './switch.module.css';

export interface ISwitchProps {
  switched: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: FC<ISwitchProps> = ({
  switched,
  onChange,
  disabled = false,
  className,
}) => {
  const themeCssVariables = useThemeCssVariables();

  const handleClick = useCallback(() => {
    if (onChange && !disabled) {
      onChange(!switched);
    }
  }, [disabled, onChange, switched]);

  return (
    <button
      data-test="Switch"
      type="button"
      role="switch"
      aria-checked={switched}
      aria-disabled={disabled}
      onClick={handleClick}
      className={clsx(
        styles.switch,
        switched && styles.switched,
        disabled && styles.disabled,
        className
      )}
      style={themeCssVariables}
    >
      <span className={clsx(styles.knob, switched && styles.knobSwitched)} />
    </button>
  );
};
