import { IStrings } from '../../constants/strings';
import type { ISqlParseResult } from './types/sql-parse-result';
import { inferSqlFields } from './infer-sql-fields';
import { SqlParser } from './sql-parser';
import { toDenormalizedSqlQuery } from './to-denormalized-sql-node';
import { createSqlDiagnostic } from './utils/create-sql-diagnostic';
import { getSqlParserString } from './utils/get-sql-parser-string';

export const tryParseSql = (
  value: string,
  textModeStrings?: IStrings['textMode']
): ISqlParseResult => {
  try {
    const parser = new SqlParser(value, textModeStrings);
    const parsedNodes = parser.parse();
    const data = toDenormalizedSqlQuery(parsedNodes);

    return {
      data,
      fields: inferSqlFields(data),
      diagnostics: [],
      parsedNodes,
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'diagnostic' in error &&
      error.diagnostic
    ) {
      return {
        diagnostics: [error.diagnostic as ReturnType<typeof createSqlDiagnostic>],
      };
    }

    return {
      diagnostics: [
        createSqlDiagnostic(
          'parse_error',
          error instanceof Error
            ? error.message
            : getSqlParserString(
                textModeStrings,
                'unknownSqlParseError',
                'Unknown SQL parse error.'
              ),
          0,
          0
        ),
      ],
    };
  }
};
