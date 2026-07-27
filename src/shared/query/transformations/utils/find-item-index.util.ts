import { NormalizedQuery } from '../../model/types/query-tree';

export const findItemIndex = (data: NormalizedQuery, id: string): number =>
  data.findIndex((item) => item.id === id);
