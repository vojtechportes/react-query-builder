import { ISqlSourceRange } from './sql-source-range';

export interface IParsedSqlScalarValue {
  value: string | number | boolean;
  range: ISqlSourceRange;
}
