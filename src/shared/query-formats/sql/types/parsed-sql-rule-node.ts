import { IDenormalizedRuleNode } from '../../../query/model/types/query-tree';
import { IParsedSqlRuleSource } from './parsed-sql-rule-source';

export type IParsedSqlRuleNode = IDenormalizedRuleNode & {
  source: IParsedSqlRuleSource;
};
