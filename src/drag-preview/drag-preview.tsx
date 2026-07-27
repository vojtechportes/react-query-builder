import React, { FC } from 'react';
import { Rule, IRuleProps } from '../rule/rule';
import { Group } from '../group/group';
import { Iterator } from '../iterator';
import { isNormalizedGroupNode } from '../shared/query/model/utils/is-normalized-group-node.util';
import { NormalizedQuery } from '../shared/query/model/types/query-tree';
import styles from './drag-preview.module.css';

export interface IDragPreviewProps {
  activeId: string;
  data: NormalizedQuery;
}

export const DragPreview: FC<IDragPreviewProps> = ({ activeId, data }) => {
  const activeItem = data.find((item) => item.id === activeId);

  if (!activeItem) {
    return null;
  }

  if (isNormalizedGroupNode(activeItem)) {
    const children = activeItem.children
      .map((childId) => data.find((item) => item.id === childId))
      .filter(Boolean) as NormalizedQuery;

    return (
      <div className={styles.previewContainer}>
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
      </div>
    );
  }

  const { field, value, operator, id } = activeItem as IRuleProps;

  return (
    <div className={styles.previewContainer}>
      <Rule field={field} value={value} operator={operator} id={id} />
    </div>
  );
};
