import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Collision,
  CollisionDetection,
  DndContextProps,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { createMoveNodeAction } from '../../history/create-move-node-action';
import { BuilderHistoryAction } from '../../history/types';

const DROP_ZONE_PROXIMITY = 24;

export interface IUseBuilderDragAndDropArgs {
  draggable: boolean;
  readOnly: boolean;
  commitData: (
    action: BuilderHistoryAction,
    options?: { trackHistory?: boolean }
  ) => boolean;
}

export const useBuilderDragAndDrop = ({
  draggable,
  readOnly,
  commitData,
}: IUseBuilderDragAndDropArgs) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZoneId, setActiveDropZoneId] = useState<string | null>(null);
  const [isDropSettling, setIsDropSettling] = useState(false);
  const dragDirectionY = useRef(0);
  const lastPointerY = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const resetDragState = useCallback(() => {
    setActiveDragId(null);
    setActiveDropZoneId(null);
  }, []);

  const onDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveDragId(String(active.id));
    dragDirectionY.current = 0;
    lastPointerY.current = null;
  }, []);

  const onDragMove = useCallback(({ activatorEvent }: DragMoveEvent) => {
    if (
      !('clientY' in activatorEvent) ||
      typeof activatorEvent.clientY !== 'number'
    ) {
      return;
    }

    const currentPointerY = activatorEvent.clientY;

    if (lastPointerY.current !== null) {
      dragDirectionY.current = currentPointerY - lastPointerY.current;
    }

    lastPointerY.current = currentPointerY;
  }, []);

  const onDragOver = useCallback(({ over }: DragOverEvent) => {
    setActiveDropZoneId(over ? String(over.id) : null);
  }, []);

  const onDragCancel = useCallback(() => {
    resetDragState();
    lastPointerY.current = null;
    setIsDropSettling(false);
  }, [resetDragState]);

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const dropZoneId = over ? String(over.id) : null;

      if (
        !draggable ||
        readOnly ||
        !dropZoneId ||
        !dropZoneId.startsWith('drop-zone:')
      ) {
        resetDragState();
        lastPointerY.current = null;
        return;
      }

      const [, destinationParentSegment, destinationIndexSegment] =
        dropZoneId.split(':');
      const destinationParentId =
        destinationParentSegment === 'root'
          ? undefined
          : destinationParentSegment;
      const destinationIndex = Number(destinationIndexSegment);

      if (Number.isNaN(destinationIndex)) {
        resetDragState();
        lastPointerY.current = null;
        return;
      }

      flushSync(() => {
        commitData(
          createMoveNodeAction(
            String(active.id),
            destinationIndex,
            destinationParentId
          )
        );
      });

      setIsDropSettling(true);
      lastPointerY.current = null;
      resetDragState();
      requestAnimationFrame(() => {
        setIsDropSettling(false);
      });
    },
    [commitData, draggable, readOnly, resetDragState]
  );

  const collisionDetection: CollisionDetection = useCallback(
    ({ pointerCoordinates, droppableContainers, droppableRects }) => {
      if (!pointerCoordinates) {
        return [];
      }

      const isMovingUp = dragDirectionY.current < 0;
      const isMovingDown = dragDirectionY.current > 0;

      const collisions = droppableContainers
        .filter((container) => String(container.id).startsWith('drop-zone:'))
        .map((container) => {
          const rect = droppableRects.get(container.id);
          const isEmptyZone = Boolean(container.data.current?.isEmpty);

          if (!rect) {
            return null;
          }

          const isWithinHorizontalBounds =
            pointerCoordinates.x >= rect.left &&
            pointerCoordinates.x <= rect.right;

          if (!isWithinHorizontalBounds) {
            return null;
          }

          const isWithinVerticalBounds =
            pointerCoordinates.y >= rect.top &&
            pointerCoordinates.y <= rect.bottom;

          if (isEmptyZone) {
            if (!isWithinVerticalBounds) {
              return null;
            }

            return {
              id: container.id,
              data: {
                droppableContainer: container,
                value: 0,
              },
            } as Collision;
          }

          if (isWithinVerticalBounds) {
            return {
              id: container.id,
              data: {
                droppableContainer: container,
                value: 0,
              },
            } as Collision;
          }

          const distanceToTop = Math.abs(pointerCoordinates.y - rect.top);
          const distanceToBottom = Math.abs(pointerCoordinates.y - rect.bottom);
          const distance = Math.min(distanceToTop, distanceToBottom);

          if (distance > DROP_ZONE_PROXIMITY) {
            return null;
          }

          if (isMovingUp && pointerCoordinates.y > rect.bottom) {
            return null;
          }

          if (isMovingDown && pointerCoordinates.y < rect.top) {
            return null;
          }

          return {
            id: container.id,
            data: {
              droppableContainer: container,
              value: distance,
            },
          } as Collision;
        })
        .filter(Boolean) as Collision[];

      return collisions.sort(
        (leftCollision, rightCollision) =>
          (leftCollision.data?.value as number) -
          (rightCollision.data?.value as number)
      );
    },
    []
  );

  const dndContextProps: Pick<
    DndContextProps,
    | 'sensors'
    | 'collisionDetection'
    | 'onDragStart'
    | 'onDragMove'
    | 'onDragOver'
    | 'onDragCancel'
    | 'onDragEnd'
  > = {
    sensors,
    collisionDetection,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragCancel,
    onDragEnd,
  };

  return {
    activeDragId,
    activeDropZoneId,
    dndContextProps,
    isDropSettling,
  };
};
