import React, { FC } from 'react';
import { Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { IEmptyGroupDropZoneProps } from '../../../empty-group-drop-zone';

export const MuiEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = ({
  id,
  index,
  parentId,
  isActive,
  isDragging,
  disableTransition = false,
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'drop-zone',
      index,
      parentId,
      isEmpty: true,
    },
  });

  return (
    <>
      <Box
        ref={setNodeRef}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: isDragging ? 'auto' : 'none',
        }}
      />
      <Box
        data-testid={isActive ? 'ActiveDropZone' : undefined}
        sx={{
          position: 'relative',
          zIndex: 0,
          width: '100%',
          boxSizing: 'border-box',
          height: isActive && isDragging ? 50 : 0,
          mt: isActive && isDragging ? 1 : 0,
          opacity: isActive && isDragging ? 1 : 0,
          overflow: 'hidden',
          transition: disableTransition
            ? 'none'
            : 'height 180ms ease, margin 180ms ease, opacity 180ms ease',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: '2px dashed',
            borderColor: isActive ? 'grey.500' : 'transparent',
            bgcolor: isActive ? 'rgba(204, 204, 204, 0.08)' : 'transparent',
            transition: disableTransition
              ? 'none'
              : 'border-color 180ms ease, background-color 180ms ease',
          }}
        />
      </Box>
    </>
  );
};
