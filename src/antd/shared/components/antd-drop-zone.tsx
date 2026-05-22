import React, { FC } from 'react';
import { theme } from 'antd';
import { IDropZoneProps, DropZone } from '../../../drop-zone';

export const AntdDropZone: FC<IDropZoneProps> = props => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        ['--antd-drop-zone-border' as string]: token.colorBorder,
      }}
    >
      <DropZone {...props} />
    </div>
  );
};
