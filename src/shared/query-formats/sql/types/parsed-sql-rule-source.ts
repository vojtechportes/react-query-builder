import { ISqlSourceRange } from './sql-source-range';

export interface IParsedSqlRuleSource {
  field: ISqlSourceRange;
  operator?: ISqlSourceRange;
  value?: ISqlSourceRange;
  valueField?: ISqlSourceRange;
  values?: ISqlSourceRange[];
}
