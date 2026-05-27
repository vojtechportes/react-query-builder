import { IDenormalizedRuleNode } from '../../../utils/query-tree';
import { IParsedSqlRuleSource } from './parsed-sql-rule-source';

export interface IParsedSqlRuleNode extends IDenormalizedRuleNode {
  source: IParsedSqlRuleSource;
}
