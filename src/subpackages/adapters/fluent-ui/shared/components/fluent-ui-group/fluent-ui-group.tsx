import { getTheme } from '@fluentui/react';
import clsx from 'clsx';
import React, { CSSProperties, FC } from 'react';
import { IGroupProps } from '../../../../../../builder/components/group/components/group-container';
import styles from './fluent-ui-group.module.css';

const theme = getTheme();

export const FluentUiGroup: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const hasDragHandle = Boolean(dragHandle);
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;
  const style = {
    '--fluent-ui-group-background': theme.palette.neutralLighterAlt,
    '--fluent-ui-group-border': theme.palette.neutralLight,
  } as CSSProperties;

  return (
    <div
      className={clsx(
        styles.group,
        hasDragHandle && styles.withDragHandle,
        className
      )}
      style={style}
    >
      {dragHandle}
      <div className={styles.body}>
        {hasHeader ? (
          <div
            className={clsx(
              styles.header,
              hasControlsLeft && styles.withLeftControls,
              hasControlsRight && styles.withRightControls
            )}
          >
            {hasControlsLeft ? (
              <div className={styles.left}>{controlsLeft}</div>
            ) : null}
            {hasControlsRight ? (
              <div className={styles.right}>{controlsRight}</div>
            ) : null}
          </div>
        ) : null}
        {contentOverlay}
        {children}
      </div>
    </div>
  );
};
