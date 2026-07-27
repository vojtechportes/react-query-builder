import { NormalizedQuery } from '../../../shared/query/model/types/query-tree';
import { IReplaceQueryAction } from '../types';

export const createReplaceQueryAction = (
  data: NormalizedQuery
): IReplaceQueryAction => ({
  type: 'replace-query',
  data,
});
