import { createId } from './create-id.util';
import { DenormalizedQuery } from './query-tree';

export const createEmptyRootGroup = (): DenormalizedQuery => [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: createId(),
    children: [],
  },
];
