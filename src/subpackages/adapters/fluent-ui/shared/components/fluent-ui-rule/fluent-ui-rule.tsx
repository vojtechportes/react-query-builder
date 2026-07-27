import { getTheme } from '@fluentui/react';
import clsx from 'clsx';
import React, { CSSProperties, FC } from 'react';
import { IRuleProps } from '../../../../../../builder/components/rule/rule-container';
import styles from './fluent-ui-rule.module.css';

const theme = getTheme();

export const FluentUiRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasDragHandle = Boolean(dragHandle);
  const hasControls = React.Children.toArray(controls).length > 0;
  const style = {
    '--fluent-ui-rule-background': theme.palette.white,
    '--fluent-ui-rule-border': theme.palette.neutralLight,
  } as CSSProperties;

  return (
    <div
      className={clsx(
        styles.rule,
        hasDragHandle && styles.withDragHandle,
        hasControls && styles.withControls,
        className
      )}
      data-test={dataTest}
      style={style}
    >
      {dragHandle}
      <div
        className={clsx(
          styles.body,
          !hasControls && styles.bodyWithoutControls
        )}
      >
        {children}
      </div>
      {hasControls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  );
};
