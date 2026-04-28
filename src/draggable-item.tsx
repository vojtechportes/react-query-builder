import React, { FC } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DragHandle } from './drag-handle';

export interface IDraggableItemProps {
  id: string;
  children: (dragHandle: React.ReactNode) => React.ReactNode;
}

export const DraggableItem: FC<IDraggableItemProps> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        type: 'item',
      },
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(0, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandle = <DragHandle {...attributes} {...listeners} />;

  if (isDragging) {
    return <div ref={setNodeRef} style={{ height: 0, overflow: 'hidden' }} />;
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children(dragHandle)}
    </div>
  );
};
