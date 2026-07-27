import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { ITextModeToggleContentProps } from '../../../../../../builder';
import styles from './antd-text-mode-toggle-content.module.css';

export const AntdTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className={styles.content}>
    {mode === 'text' ? (
      <AppstoreOutlined aria-hidden="true" />
    ) : (
      <CodeOutlined aria-hidden="true" />
    )}
    <span className={styles.label}>{label}</span>
  </span>
);
