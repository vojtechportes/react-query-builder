import { ISqlSourceRange } from './sql-source-range';

export interface IParsedSqlRuleSource {
  field: ISqlSourceRange;
  operator?: ISqlSourceRange;
  value?: ISqlSourceRange;
  values?: ISqlSourceRange[];
}
