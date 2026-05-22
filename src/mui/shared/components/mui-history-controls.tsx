import React, { FC } from 'react';
import { Box } from '@mui/material';
import { IHistoryControlsProps } from '../../../builder';

export const MuiHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <Box sx={{ display: 'flex', gap: 1 }} className={className}>
    {undoButton}
    {redoButton}
  </Box>
);
