import React, { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { IGroupProps } from '../../../group/group-container';

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
      <Box sx={{ position: 'relative', p: 1.4 }}>
        {hasHeader ? (
          <Box
            sx={{
              display: 'grid',
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
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: 'min-content',
                  gridAutoFlow: 'column',
                  alignSelf: 'end',
                  justifySelf: 'start',
                }}
              >
                {controlsLeft}
              </Box>
            ) : null}
            {hasControlsRight ? (
              <Box
                sx={{
                  display: 'grid',
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
