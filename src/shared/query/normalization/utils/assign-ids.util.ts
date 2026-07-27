import { clone } from '../../model/utils/clone.util';
import { createId } from '../../model/utils/create-id.util';
import { isDenormalizedGroupNode } from '../../model/utils/is-denormalized-group-node.util';
import {
  DenormalizedNode,
  DenormalizedQuery,
} from '../../model/types/query-tree';

interface ITreeContainer {
  children: DenormalizedQuery;
}

export const assignIds = (data: DenormalizedQuery): DenormalizedQuery => {
  const dataWithContainer: ITreeContainer = { children: clone(data) };

  const run = (
    item: DenormalizedNode | ITreeContainer
  ): DenormalizedNode | ITreeContainer => {
    if ('children' in item) {
      item.children = item.children.map((childItem) => {
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

  return (run(dataWithContainer) as ITreeContainer).children;
};
