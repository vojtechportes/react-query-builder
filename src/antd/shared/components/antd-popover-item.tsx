import React, { FC } from 'react';
import { Button } from 'antd';
import { IPopoverItemProps } from '../../../popover-item';

export const AntdPopoverItem: FC<IPopoverItemProps> = ({
  label,
  onClick,
  className,
  'data-test': dataTest,
}) => (
  <Button
    type="text"
    onClick={event =>
      onClick(event as unknown as React.MouseEvent<HTMLButtonElement>)
    }
    className={className}
    data-test={dataTest}
    style={{ width: '100%', justifyContent: 'flex-start' }}
  >
    {label}
  </Button>
);
