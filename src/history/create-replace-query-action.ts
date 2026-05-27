import { NormalizedQuery } from '../utils/query-tree';
import { IReplaceQueryAction } from './types';

export const createReplaceQueryAction = (
  data: NormalizedQuery
): IReplaceQueryAction => ({
  type: 'replace-query',
  data,
});
