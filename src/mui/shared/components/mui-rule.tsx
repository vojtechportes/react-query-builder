import React, { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { IRuleProps } from '../../../rule/rule-container';

export const MuiRule: FC<IRuleProps> = ({
  children,
  controls,
  dragHandle,
  className,
  'data-test': dataTest,
}) => {
  const hasControls = React.Children.toArray(controls).length > 0;

  return (
    <Paper
      variant="outlined"
      className={className}
      data-test={dataTest}
      sx={{
        display: 'grid',
        gridTemplateColumns: hasControls
          ? dragHandle
            ? 'auto minmax(0, 1fr) auto'
            : 'minmax(0, 1fr) auto'
          : dragHandle
            ? 'auto minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
        mt: 1,
        bgcolor: 'background.paper',
      }}
    >
      {dragHandle}
      <Box sx={{ minWidth: 0, p: 1.4, pr: hasControls ? 0 : 1.4 }}>
        {children}
      </Box>
      {hasControls ? (
        <Box
          sx={{
            display: 'grid',
            gridAutoColumns: 'min-content',
            gridAutoFlow: 'column',
            gap: 1,
            alignSelf: 'start',
            p: 1.4,
            '@media (max-width:900px)': {
              pl: 1,
            },
          }}
        >
          {controls}
        </Box>
      ) : null}
    </Paper>
  );
};
