import { getTheme } from '@fluentui/react';
import clsx from 'clsx';
import React, { CSSProperties, FC } from 'react';
import { IOptionProps } from '../../../../../../builder/components/group/components/option';
import styles from './fluent-ui-group-header-option.module.css';

const theme = getTheme();

export const FluentUiGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => {
  const optionStyle = {
    '--fluent-ui-option-background': disabled
      ? isSelected
        ? theme.palette.neutralQuaternaryAlt
        : theme.palette.neutralLight
      : isSelected
        ? theme.palette.themePrimary
        : theme.palette.neutralTertiary,
    '--fluent-ui-option-border': disabled
      ? isSelected
        ? theme.palette.neutralSecondary
        : theme.palette.neutralTertiary
      : theme.palette.neutralPrimary,
    '--fluent-ui-option-color': disabled
      ? isSelected
        ? theme.palette.neutralPrimary
        : theme.palette.neutralTertiaryAlt
      : theme.palette.white,
    '--fluent-ui-option-focus-outline': theme.palette.themeLight,
    '--fluent-ui-option-hover-background': disabled
      ? isSelected
        ? theme.palette.neutralQuaternaryAlt
        : theme.palette.neutralLight
      : isSelected
        ? theme.palette.themeDark
        : theme.palette.neutralSecondary,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={clsx(
        styles.option,
        isSelected && styles.selected,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onClick(value);
        }
      }}
      style={optionStyle}
    >
      {children}
    </button>
  );
};
