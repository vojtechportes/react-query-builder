import clsx from 'clsx';
import React, { FC } from 'react';
import inputStyles from '../../../../../theme/styles/input.module.css';
import styles from './trigger.module.css';

export interface ITriggerProps {
  badgeContent?: string;
  disabled: boolean;
  expanded: boolean;
  id?: string;
  label: string;
  onClick: () => void;
  title?: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export const Trigger: FC<ITriggerProps> = ({
  badgeContent,
  disabled,
  expanded,
  id,
  label,
  onClick,
  title,
  triggerRef,
}) => {
  return (
    <button
      ref={triggerRef}
      type="button"
      id={id}
      data-test="SelectMultiTrigger"
      aria-haspopup="listbox"
      aria-expanded={expanded}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={clsx(
        inputStyles.control,
        inputStyles.typography,
        styles.trigger,
        expanded && styles.expanded
      )}
    >
      <span className={styles.label}>{label}</span>
      {badgeContent ? (
        <span
          data-test="SelectMultiSummaryBadge"
          className={styles.summaryBadge}
        >
          {badgeContent}
        </span>
      ) : null}
      <span className={styles.chevron} />
    </button>
  );
};
