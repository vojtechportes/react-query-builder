import { NormalizedQuery } from './query-tree';

export const findItemIndex = (data: NormalizedQuery, id: string): number =>
  data.findIndex(item => item.id === id);
