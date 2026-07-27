import { ISqlSourceRange } from './sql-source-range';

export interface IParsedSqlArrayValue {
  value: string[] | number[];
  range: ISqlSourceRange;
  values: ISqlSourceRange[];
}
