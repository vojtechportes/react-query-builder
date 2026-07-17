import React, { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { IGroupProps } from '../../../group/group-container';
import { MuiGroupHeaderControls } from './mui-group-header-controls';

export const MuiGroup: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <Paper
      variant="outlined"
      className={className}
      sx={{
        display: 'grid',
        gridTemplateColumns: dragHandle
          ? 'auto minmax(0, 1fr)'
          : 'minmax(0, 1fr)',
        bgcolor: 'grey.100',
        mt: 1,
      }}
    >
      {dragHandle}
      <Box data-test="MuiGroupBody" sx={{ position: 'relative', p: '12px' }}>
        {hasHeader ? (
          <Box
            data-test="MuiGroupHeader"
            sx={{
              display: 'grid',
              alignItems: 'center',
              gap: 2,
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              pb: 1,
              borderBottom: 1,
              borderColor: 'divider',
              '@media (max-width:900px)': {
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: 1.5,
              },
            }}
          >
            {hasControlsLeft ? (
              <MuiGroupHeaderControls>{controlsLeft}</MuiGroupHeaderControls>
            ) : null}
            {hasControlsRight ? (
              <Box
                data-test="MuiGroupHeaderActions"
                sx={{
                  display: 'grid',
                  alignItems: 'center',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  gap: 1,
                  justifySelf: 'end',
                  '@media (max-width:900px)': {
                    justifySelf: 'start',
                    gridAutoFlow: 'row',
                    gridTemplateColumns: 'repeat(3, minmax(0, max-content))',
                  },
                }}
              >
                {controlsRight}
              </Box>
            ) : null}
          </Box>
        ) : null}
        {contentOverlay}
        {children}
      </Box>
    </Paper>
  );
};
