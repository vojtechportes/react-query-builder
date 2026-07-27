import { createSqlDiagnostic } from './create-sql-diagnostic';
import { ISqlDiagnostic } from '../types/sql-diagnostic';

export const createSqlParseError = (
  code: string,
  message: string,
  start: number,
  end: number
): Error & { diagnostic: ISqlDiagnostic } => {
  const error = new Error(message) as Error & { diagnostic: ISqlDiagnostic };
  error.diagnostic = createSqlDiagnostic(code, message, start, end);

  return error;
};
