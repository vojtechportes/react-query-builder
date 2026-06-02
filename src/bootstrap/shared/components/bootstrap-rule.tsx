import React, { FC } from 'react';
import { IRuleProps } from '../../../rule/rule-container';
import { bootstrapCardStyles, joinClassNames } from './styles';

export const BootstrapRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <div
      className={joinClassNames('border bg-body mt-2', className)}
      data-test={dataTest}
      style={{
        ...bootstrapCardStyles,
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: dragHandle
          ? hasControls
            ? 'auto minmax(0, 1fr) auto'
            : 'auto minmax(0, 1fr)'
          : hasControls
            ? 'minmax(0, 1fr) auto'
            : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <div className={joinClassNames('min-w-0 p-3', !hasControls && 'pe-3')}>{children}</div>
      {hasControls ? (
        <div className="d-flex flex-wrap align-items-start gap-2 p-3">{controls}</div>
      ) : null}
    </div>
  );
};
