import React, { FC } from 'react';
import { Space } from 'antd';
import { IHistoryControlsProps } from '../../../builder';

export const AntdHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => <Space className={className}>{undoButton}{redoButton}</Space>;
