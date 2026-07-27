import React, { FC, PropsWithChildren } from 'react';
import styles from './option.module.css';

export const Option: FC<PropsWithChildren> = ({ children }) => (
  <span className={styles.option}>{children}</span>
);
