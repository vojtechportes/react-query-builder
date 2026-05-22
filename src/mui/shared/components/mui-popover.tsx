import React, { FC, useState } from 'react';
import { Button, Menu } from '@mui/material';
import { IPopoverProps } from '../../../popover';
import { menuPaperSx } from './styles';

export const MuiPopover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className={className}
        data-test={dataTest}
        size="small"
        sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap', minHeight: '2rem' }}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: menuPaperSx } }}
      >
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
              setAnchorEl(null);
            },
          });
        })}
      </Menu>
    </>
  );
};
