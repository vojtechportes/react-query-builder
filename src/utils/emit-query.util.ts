import { denormalizeTree } from './denormalize-tree.util';
import { DenormalizedQuery, NormalizedQuery } from './query-tree';

export const emitQuery = (inputQuery: NormalizedQuery): DenormalizedQuery => {
  try {
    return denormalizeTree(inputQuery);
  } catch (error) {
    throw new Error('Input data tree is in invalid format');
  }
};
