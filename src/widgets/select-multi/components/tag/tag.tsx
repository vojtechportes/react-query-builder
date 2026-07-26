import clsx from 'clsx';
import React, { FC } from 'react';
import { RemoveIcon } from '../remove-icon';
import styles from './tag.module.css';

export interface ITagProps {
  disabled: boolean;
  label: string;
  value: string;
  onRemove: (value: string) => void;
}

export const Tag: FC<ITagProps> = ({ disabled, label, value, onRemove }) => {
  const hasRemoveButton = !disabled;

  return (
    <span
      data-test="SelectMultiTag"
      className={clsx(styles.tag, hasRemoveButton && styles.removable)}
    >
      <span className={styles.label}>{label}</span>
      {hasRemoveButton ? (
        <button
          type="button"
          data-test="Delete"
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={() => onRemove(value)}
          className={styles.removeButton}
        >
          <RemoveIcon />
        </button>
      ) : null}
    </span>
  );
};
