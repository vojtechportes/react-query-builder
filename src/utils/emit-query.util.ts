import {
  denormalizeTree,
  IDenormalizeTreeOptions,
} from './denormalize-tree.util';
import { DenormalizedQuery, NormalizedQuery } from './query-tree';

export const emitQuery = (
  inputQuery: NormalizedQuery,
  options: IDenormalizeTreeOptions = {}
): DenormalizedQuery => {
  try {
    return denormalizeTree(inputQuery, options);
  } catch (error) {
    throw new Error('Input data tree is in invalid format');
  }
};
