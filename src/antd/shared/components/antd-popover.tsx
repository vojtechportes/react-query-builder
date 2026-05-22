import React, { FC, useMemo, useState } from 'react';
import { Button, Popover, Space } from 'antd';
import { IPopoverProps } from '../../../popover';
import { antdTextButtonStyle } from './styles';

export const AntdPopover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const [open, setOpen] = useState(false);

  const content = useMemo(
    () => (
      <Space direction="vertical" size={4} style={{ minWidth: 180 }}>
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) {
            return child;
          }

          const originalOnClick = child.props.onClick as
            | React.MouseEventHandler<HTMLElement>
            | undefined;

          return React.cloneElement(child, {
            onClick: (event: React.MouseEvent<HTMLElement>) => {
              originalOnClick?.(event);
              setOpen(false);
            },
          });
        })}
      </Space>
    ),
    [children]
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      content={content}
      placement="bottomLeft"
    >
      <Button
        type="primary"
        onClick={() => setOpen(value => !value)}
        className={className}
        data-test={dataTest}
        style={antdTextButtonStyle}
      >
        {label}
      </Button>
    </Popover>
  );
};
