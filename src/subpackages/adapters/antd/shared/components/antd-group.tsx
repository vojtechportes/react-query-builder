import React, { FC } from 'react';
import { Row, Space, theme } from 'antd';
import { IGroupProps } from '../../../../../builder/components/group/components/group-container';

export const AntdGroup: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const { token } = theme.useToken();
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        overflow: 'hidden',
        gridTemplateColumns: dragHandle
          ? 'auto minmax(0, 1fr)'
          : 'minmax(0, 1fr)',
        marginTop: '0.5rem',
        backgroundColor: token.colorFillAlter,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      {dragHandle}
      <div style={{ position: 'relative', padding: '0.85rem' }}>
        {hasHeader ? (
          <Row
            align="middle"
            justify="space-between"
            style={{
              gap: token.marginSM,
              paddingBottom: '0.75rem',
              marginBottom: '0.25rem',
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {hasControlsLeft ? <Space size={0}>{controlsLeft}</Space> : null}
            {hasControlsRight ? (
              <Space wrap size={token.marginXS} style={{ maxWidth: '100%' }}>
                {controlsRight}
              </Space>
            ) : null}
          </Row>
        ) : null}
        {contentOverlay}
        {children}
      </div>
    </div>
  );
};
