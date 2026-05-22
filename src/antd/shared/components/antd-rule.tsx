import React, { FC } from 'react';
import { theme } from 'antd';
import { IRuleProps } from '../../../rule/rule-container';

export const AntdRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const { token } = theme.useToken();
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <div
      className={className}
      data-test={dataTest}
      style={{
        display: 'grid',
        gridTemplateColumns: hasControls
          ? dragHandle
            ? 'auto minmax(0, 1fr) auto'
            : 'minmax(0, 1fr) auto'
          : dragHandle
            ? 'auto minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
        marginTop: '0.5rem',
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      {dragHandle}
      <div style={{ minWidth: 0, padding: '0.85rem', paddingRight: hasControls ? 0 : '0.85rem' }}>
        {children}
      </div>
      {hasControls ? (
        <div
          style={{
            display: 'grid',
            gridAutoColumns: 'min-content',
            gridAutoFlow: 'column',
            gap: '0.5rem',
            alignSelf: 'start',
            padding: '0.85rem',
          }}
        >
          {controls}
        </div>
      ) : null}
    </div>
  );
};
