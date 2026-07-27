import React, { FC } from 'react';
import { ITextModeToggleContentProps } from '../../../../builder';
import { BuilderModeIcon } from '../../../../builder/components/builder-mode-icon';
import { TextModeIcon } from '../../../../builder/components/text-mode-icon';
import styles from './mantine-text-mode-toggle-content.module.css';

export const MantineTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className={styles.content}>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span className={styles.label}>{label}</span>
  </span>
);
