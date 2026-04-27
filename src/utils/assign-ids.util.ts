import { clone } from './clone.util';
import { createId } from './create-id.util';
import { isDenormalizedGroupNode } from './is-denormalized-group-node.util';
import { DenormalizedNode, DenormalizedQuery } from './query-tree';

interface TreeContainer {
  children: DenormalizedQuery;
}

export const assignIds = (data: DenormalizedQuery): DenormalizedQuery => {
  const dataWithContainer: TreeContainer = { children: clone(data) };

  const run = (
    item: DenormalizedNode | TreeContainer
  ): DenormalizedNode | TreeContainer => {
    if ('children' in item) {
      item.children = item.children.map(childItem => {
        if (!childItem.id) {
          childItem.id = createId();
        }

        if (isDenormalizedGroupNode(childItem)) {
          return run(childItem) as DenormalizedNode;
        }

        return childItem;
      });
    }

    return item;
  };

  return (run(dataWithContainer) as TreeContainer).children;
};
