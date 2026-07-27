import { NormalizedQuery } from '../../../../shared/query/model/types/query-tree';
import { BuilderNewNodePlacement } from '../../../types';
import { createAppendNodeIndex } from './create-append-node-index.util';

export const createDefaultNodeIndex = (
  data: NormalizedQuery,
  parentId: string | undefined,
  placement: BuilderNewNodePlacement
): number | null => {
  if (placement === 'prepend') {
    return 0;
  }

  return createAppendNodeIndex(data, parentId);
};
