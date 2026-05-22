import React, { FC } from 'react';
import { Button } from 'antd';
import { IButtonProps } from '../../../button';
import { resolveButtonContent } from './button-utils';
import { antdTextButtonStyle } from './styles';

export const AntdAddButton: FC<IButtonProps> = (props) => (
  <Button
    type="primary"
    onClick={props.onClick}
    disabled={props.disabled}
    className={props.className}
    data-test={props['data-test']}
    style={antdTextButtonStyle}
  >
    {resolveButtonContent(props)}
  </Button>
);
