import React, { FC } from 'react';
import { theme } from 'antd';
import { IGroupProps } from '../../../group/group-container';

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
        gridTemplateColumns: dragHandle ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
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
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              paddingBottom: '0.75rem',
              marginBottom: '0.25rem',
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {hasControlsLeft ? (
              <div
                style={{
                  display: 'grid',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  alignSelf: 'end',
                  justifySelf: 'start',
                }}
              >
                {controlsLeft}
              </div>
            ) : null}
            {hasControlsRight ? (
              <div
                style={{
                  display: 'grid',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  gap: '0.5rem',
                  justifySelf: 'end',
                }}
              >
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
