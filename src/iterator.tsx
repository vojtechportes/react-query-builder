import React, { FC, useContext } from 'react';
import { BuilderContext } from './builder-context';
import { Rule, IRuleProps } from './rule/rule';
import { DraggableItem } from './draggable-item';
import { DropZone as DefaultDropZone } from './drop-zone';
import { EmptyGroupDropZone as DefaultEmptyGroupDropZone } from './empty-group-drop-zone';
import { Group } from './group/group';
import { isNormalizedGroupNode } from './utils/is-normalized-group-node.util';
import { NormalizedQuery } from './utils/query-tree';

export interface IIteratorProps {
  originalData: NormalizedQuery;
  filteredData: NormalizedQuery;
  containerId?: string;
  isRoot?: boolean;
  activeDropZoneId?: string | null;
  activeDragId?: string | null;
  isDragging?: boolean;
  isOverlay?: boolean;
  disableDropZoneTransition?: boolean;
}

export const Iterator: FC<IIteratorProps> = ({
  originalData,
  filteredData,
  containerId = 'root',
  isRoot = true,
  activeDropZoneId = null,
  activeDragId = null,
  isDragging = false,
  isOverlay = false,
  disableDropZoneTransition = false,
}) => {
  const { draggable, readOnly, components } = useContext(BuilderContext);
  const resolvedComponents = components || {};
  const {
    DropZone = DefaultDropZone,
    EmptyGroupDropZone = DefaultEmptyGroupDropZone,
  } = resolvedComponents;
  const isSortable = draggable && !readOnly && !isOverlay;
  const activeDragIndex = activeDragId
    ? filteredData.findIndex((item) => item.id === activeDragId)
    : -1;
  const itemCount = filteredData.length;

  const content = filteredData.flatMap((item, index) => {
    const dropZoneId = `drop-zone:${containerId}:${index}`;
    const shouldRenderLeadingDropZone = index > 0 || itemCount > 0;
    const isCollapsedSourceBoundary =
      activeDragIndex !== -1 && index === activeDragIndex + 1;
    const leadingDropZone =
      isSortable && shouldRenderLeadingDropZone ? (
        <DropZone
          key={dropZoneId}
          id={dropZoneId}
          index={index}
          parentId={containerId === 'root' ? undefined : containerId}
          isActive={activeDropZoneId === dropZoneId}
          isDragging={isDragging}
          disableTransition={disableDropZoneTransition}
        />
      ) : null;

    if (isNormalizedGroupNode(item)) {
      const items = item.children
        .map((childId) =>
          originalData.find((originalItem) => childId === originalItem.id)
        )
        .filter(Boolean) as NormalizedQuery;

      const { id, value, isNegated } = item;
      const emptyGroupDropZoneId = `drop-zone:${id}:0`;
      const emptyGroupDropZone =
        isSortable && items.length === 0 ? (
          <EmptyGroupDropZone
            id={emptyGroupDropZoneId}
            index={0}
            parentId={id}
            isActive={activeDropZoneId === emptyGroupDropZoneId}
            isDragging={isDragging}
            disableTransition={disableDropZoneTransition}
          />
        ) : null;

      const group = (dragHandle?: React.ReactNode) => (
        <Group
          key={id}
          value={value}
          isNegated={isNegated}
          id={id}
          isRoot={isRoot}
          dragHandle={dragHandle}
          contentOverlay={emptyGroupDropZone}
        >
          <Iterator
            originalData={originalData}
            filteredData={items}
            containerId={id}
            isRoot={false}
            activeDropZoneId={activeDropZoneId}
            activeDragId={activeDragId}
            isDragging={isDragging}
            isOverlay={isOverlay}
            disableDropZoneTransition={disableDropZoneTransition}
          />
        </Group>
      );

      if (!isSortable) {
        return [group()];
      }

      return [
        !isCollapsedSourceBoundary ? leadingDropZone : null,
        <DraggableItem key={id} id={id}>
          {(dragHandle) => group(dragHandle)}
        </DraggableItem>,
      ];
    }

    const { field, value, id, operator } = item as IRuleProps;

    const rule = (dragHandle?: React.ReactNode) => (
      <Rule
        key={id}
        field={field}
        value={value}
        operator={operator}
        id={id}
        dragHandle={dragHandle}
        data-test="IteratorRule"
      />
    );

    if (!isSortable) {
      return [rule()];
    }

    return [
      !isCollapsedSourceBoundary ? leadingDropZone : null,
      <DraggableItem key={id} id={id}>
        {(dragHandle) => rule(dragHandle)}
      </DraggableItem>,
    ];
  });

  if (!isSortable) {
    return <>{content}</>;
  }

  const endDropZoneId = `drop-zone:${containerId}:${filteredData.length}`;
  const isEmptyGroupContainer =
    containerId !== 'root' && filteredData.length === 0;

  return (
    <>
      {content}
      {!isEmptyGroupContainer &&
        !(
          activeDragIndex !== -1 && activeDragIndex + 1 === filteredData.length
        ) && (
          <DropZone
            id={endDropZoneId}
            index={filteredData.length}
            parentId={containerId === 'root' ? undefined : containerId}
            isActive={activeDropZoneId === endDropZoneId}
            isDragging={isDragging}
            isEmpty={filteredData.length === 0}
            disableTransition={disableDropZoneTransition}
          />
        )}
    </>
  );
};
