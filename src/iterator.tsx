import React from 'react';
import { Component, ComponentProps } from './component/component';
import { Group } from './group/group';
import { isNormalizedGroupNode } from './utils/is-normalized-group-node.util';
import { NormalizedQuery } from './utils/query-tree';

export interface IteratorProps {
  originalData: NormalizedQuery;
  filteredData: NormalizedQuery;
  isRoot?: boolean;
}

export const Iterator: React.FC<IteratorProps> = ({
  originalData,
  filteredData,
  isRoot = true,
}) => (
  <>
    {filteredData.map(item => {
      if (isNormalizedGroupNode(item)) {
        const items = item.children
          .map(childId =>
            originalData.find(originalItem => childId === originalItem.id)
          )
          .filter(Boolean) as NormalizedQuery;

        const { id, value, isNegated } = item;

        return (
          <Group
            key={id}
            value={value}
            isNegated={isNegated}
            id={id}
            isRoot={isRoot}
          >
            <Iterator
              originalData={originalData}
              filteredData={items}
              isRoot={false}
            />
          </Group>
        );
      }

      const { field, value, id, operator } = item as ComponentProps;

      return (
        <Component
          key={id}
          field={field}
          value={value}
          operator={operator}
          id={id}
          data-test="IteratorComponent"
        />
      );
    })}
  </>
);
