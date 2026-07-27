import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { Button, IButtonProps } from '../button';
import styles from './secondary-button.module.css';

export const SecondaryButton: FC<PropsWithChildren<IButtonProps>> = ({
  className,
  ...rest
}) => <Button className={clsx(styles.secondaryButton, className)} {...rest} />;
