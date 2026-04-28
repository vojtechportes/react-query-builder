import React, { FC } from 'react';
import styled from 'styled-components';
import { Rule, IRuleProps } from './rule/rule';
import { Group } from './group/group';
import { Iterator } from './iterator';
import { isNormalizedGroupNode } from './utils/is-normalized-group-node.util';
import { NormalizedQuery } from './utils/query-tree';

const PreviewContainer = styled.div`
  pointer-events: none;
  min-width: 320px;
  max-width: min(960px, calc(100vw - 3rem));
  opacity: 0.95;
`;

export interface IDragPreviewProps {
  activeId: string;
  data: NormalizedQuery;
}

export const DragPreview: FC<IDragPreviewProps> = ({ activeId, data }) => {
  const activeItem = data.find(item => item.id === activeId);

  if (!activeItem) {
    return null;
  }

  if (isNormalizedGroupNode(activeItem)) {
    const children = activeItem.children
      .map(childId => data.find(item => item.id === childId))
      .filter(Boolean) as NormalizedQuery;

    return (
      <PreviewContainer>
        <Group
          id={activeItem.id}
          value={activeItem.value}
          isNegated={activeItem.isNegated}
          isRoot={!activeItem.parent}
        >
          <Iterator
            originalData={data}
            filteredData={children}
            containerId={activeItem.id}
            isRoot={false}
            activeDragId={null}
            isDragging={false}
            isOverlay
          />
        </Group>
      </PreviewContainer>
    );
  }

  const { field, value, operator, id } = activeItem as IRuleProps;

  return (
    <PreviewContainer>
      <Rule field={field} value={value} operator={operator} id={id} />
    </PreviewContainer>
  );
};
