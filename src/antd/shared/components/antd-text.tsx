import React, { FC, PropsWithChildren } from 'react';
import { Typography } from 'antd';

export const AntdText: FC<PropsWithChildren> = ({ children }) => (
  <Typography.Text
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      minWidth: 160,
      minHeight: '2rem',
      padding: '0.4rem 0.6rem',
      border: '1px solid rgba(5, 5, 5, 0.15)',
      borderRadius: 6,
    }}
  >
    {children}
  </Typography.Text>
);
