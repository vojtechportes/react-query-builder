import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { Button, IButtonProps } from '../button';
import styles from './outlined-button.module.css';

export const OutlinedButton: FC<PropsWithChildren<IButtonProps>> = ({
  className,
  ...rest
}) => <Button className={clsx(styles.outlinedButton, className)} {...rest} />;
