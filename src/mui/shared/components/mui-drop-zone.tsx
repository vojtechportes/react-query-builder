import React, { FC } from 'react';
import { Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { IDropZoneProps } from '../../../drop-zone';

export const MuiDropZone: FC<IDropZoneProps> = ({
  id,
  index,
  parentId,
  isActive,
  isDragging,
  isEmpty = false,
  disableTransition = false,
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'drop-zone',
      index,
      parentId,
      isEmpty,
    },
  });

  return (
    <Box
      ref={setNodeRef}
      data-test={isActive ? 'ActiveDropZone' : undefined}
      sx={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'visible',
        transition: disableTransition
          ? 'none'
          : 'height 180ms ease, margin 180ms ease, border-color 180ms ease, background-color 180ms ease, opacity 180ms ease',
        opacity: !isDragging ? 0 : isActive || isEmpty ? 1 : 0.45,
        height: isEmpty ? 50 : isDragging && isActive ? 50 : 0,
        mt: isEmpty || (isDragging && isActive) ? 1 : 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: '2px dashed',
          borderColor: isActive ? 'grey.300' : 'transparent',
          bgcolor: isActive ? 'rgba(204, 204, 204, 0.08)' : 'transparent',
          transform: `scaleY(${isActive || isEmpty ? 1 : 0.7})`,
          transformOrigin: 'center',
          transition: disableTransition
            ? 'none'
            : 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease, opacity 180ms ease',
          opacity: isActive || isEmpty ? 1 : 0.35,
        }}
      />
    </Box>
  );
};
