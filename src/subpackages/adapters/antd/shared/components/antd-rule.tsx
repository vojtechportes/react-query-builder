import React, { FC } from 'react';
import { Row, Space, theme } from 'antd';
import { IRuleProps } from '../../../../../builder/components/rule/rule-container';

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
        overflow: 'hidden',
        gridTemplateColumns: dragHandle
          ? 'auto minmax(0, 1fr)'
          : 'minmax(0, 1fr)',
        marginTop: '0.5rem',
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      {dragHandle}
      <Row align="top" style={{ gap: token.marginXS, padding: '0.85rem' }}>
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>{children}</div>
        {hasControls ? (
          <Space wrap size={token.marginXS} style={{ maxWidth: '100%' }}>
            {controls}
          </Space>
        ) : null}
      </Row>
    </div>
  );
};
