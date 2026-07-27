import CodeIcon from '@mui/icons-material/Code';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import React, { FC } from 'react';
import { ITextModeToggleContentProps } from '../../../../../../builder';
import styles from './mui-text-mode-toggle-content.module.css';

const iconSx = { flexShrink: 0, fontSize: '1rem' } as const;

export const MuiTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className={styles.content}>
    {mode === 'text' ? (
      <ViewAgendaIcon aria-hidden="true" sx={iconSx} />
    ) : (
      <CodeIcon aria-hidden="true" sx={iconSx} />
    )}
    <span className={styles.label}>{label}</span>
  </span>
);
