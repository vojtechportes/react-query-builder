import React, { FC } from 'react';
import { BuilderModeIcon } from '../builder-mode-icon/builder-mode-icon';
import styles from './text-mode-toggle-content.module.css';
import { TextModeIcon } from '../text-mode-icon/text-mode-icon';

export interface ITextModeToggleContentProps {
  mode: 'builder' | 'text';
  label: string;
}

export const TextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className={styles.content}>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span className={styles.label}>{label}</span>
  </span>
);
