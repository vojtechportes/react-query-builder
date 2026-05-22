import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { ICloneButtonProps } from '../../../clone-button';
import { getAntdCloneTitle, useAntdBuilderStrings } from './copy';
import { antdIconButtonStyle } from './styles';

export const AntdCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useAntdBuilderStrings();
  const resolvedTitle = getAntdCloneTitle(title, nodeType, strings);

  return (
    <Tooltip title={resolvedTitle}>
      <Button
        type="default"
        icon={<CopyOutlined />}
        onClick={onClick}
        disabled={disabled}
        className={className}
        aria-label={resolvedTitle}
        data-test={dataTest}
        style={antdIconButtonStyle}
      />
    </Tooltip>
  );
};
