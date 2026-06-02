import React, { FC } from 'react';
import { IGroupProps } from '../../../group/group-container';
import { bootstrapCardStyles, joinClassNames } from './styles';

export const BootstrapGroup: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <div
      className={joinClassNames('border bg-body-tertiary shadow-sm mt-2', className)}
      style={{
        ...bootstrapCardStyles,
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: dragHandle ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <div className="position-relative p-3">
        {hasHeader ? (
          <div
            className="pb-3 mb-2 border-bottom"
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
            }}
          >
            {hasControlsLeft ? (
              <div className="btn-group btn-group-sm" role="group">
                {controlsLeft}
              </div>
            ) : null}
            {hasControlsRight ? (
              <div className="d-flex flex-wrap justify-content-end gap-2">
                {controlsRight}
              </div>
            ) : null}
          </div>
        ) : null}
        {contentOverlay}
        {children}
      </div>
    </div>
  );
};
