import React, { FC } from 'react';
import { IRuleProps } from '../../../../../builder/components/rule/rule-container';
import { bootstrapCardStyles, joinClassNames } from './styles';

export const BootstrapRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const actions =
    React.isValidElement<{ children?: React.ReactNode }>(controls) &&
    controls.type === React.Fragment
      ? controls.props.children
      : controls;
  const hasControls = React.Children.toArray(actions).length > 0;

  return (
    <div
      className={joinClassNames('border bg-body mt-2', className)}
      data-test={dataTest}
      style={{
        ...bootstrapCardStyles,
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: dragHandle
          ? 'auto minmax(0, 1fr)'
          : 'minmax(0, 1fr)',
      }}
    >
      {dragHandle}
      <div className="d-flex flex-wrap align-items-start gap-2 p-3">
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>{children}</div>
        {hasControls ? (
          <div className="d-flex flex-wrap gap-2" style={{ maxWidth: '100%' }}>
            {controls}
          </div>
        ) : null}
      </div>
    </div>
  );
};
