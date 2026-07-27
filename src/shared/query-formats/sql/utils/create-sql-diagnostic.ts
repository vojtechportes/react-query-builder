import { ISqlDiagnostic } from '../types/sql-diagnostic';

export const createSqlDiagnostic = (
  code: string,
  message: string,
  start: number,
  end: number
): ISqlDiagnostic => ({
  code,
  message,
  start,
  end,
});
