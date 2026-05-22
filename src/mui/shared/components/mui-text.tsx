import React, { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';

export const MuiText: FC<PropsWithChildren> = ({ children }) => (
  <Box
    component="span"
    sx={{
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      minWidth: 160,
      minHeight: '2rem',
      px: 1.5,
      py: 1,
      color: 'text.primary',
      fontSize: '0.8rem',
      lineHeight: 1.3,
      border: 1,
      borderColor: 'grey.500',
      borderRadius: 1,
    }}
  >
    {children}
  </Box>
);
