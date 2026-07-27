import clsx from 'clsx';
import React, { FC, useCallback } from 'react';
import { getCloneButtonTitle } from '../builder/utils/get-clone-button-title.util';
import styles from './clone-button.module.css';
import { CloneIcon } from './clone-icon';

export interface ICloneButtonProps {
  nodeType: 'rule' | 'group';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  'data-test'?: string;
}

export const CloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }

    onClick?.();
  }, [disabled, onClick]);

  const resolvedTitle = title || getCloneButtonTitle(undefined, nodeType);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        styles.cloneButton,
        disabled && styles.disabled,
        className
      )}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
    >
      <CloneIcon />
    </button>
  );
};
