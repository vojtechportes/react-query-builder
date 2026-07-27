import React, { FC } from 'react';
import { ITextModeToggleContentProps } from '../../../../../../builder';
import { BuilderModeIcon } from '../../../../../../builder/text-mode/components/builder-mode-icon/builder-mode-icon';
import { TextModeIcon } from '../../../../../../builder/text-mode/components/text-mode-icon/text-mode-icon';
import styles from './fluent-ui-text-mode-toggle-content.module.css';

export const FluentUiTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className={styles.content}>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span className={styles.label}>{label}</span>
  </span>
);
