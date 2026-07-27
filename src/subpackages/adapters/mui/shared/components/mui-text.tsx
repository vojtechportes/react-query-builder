import React, { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';

export const MuiText: FC<PropsWithChildren> = ({ children }) => (
  <Box
    component="span"
    sx={{
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      minWidth: 160,
      height: muiControlDensitySx.height,
      minHeight: muiControlDensitySx.minHeight,
      px: 1.5,
      py: 0.5,
      color: 'text.primary',
      fontSize: muiControlDensitySx.fontSize,
      lineHeight: 1.3,
      border: 1,
      borderColor: 'grey.500',
      borderRadius: 1,
    }}
  >
    {children}
  </Box>
);
