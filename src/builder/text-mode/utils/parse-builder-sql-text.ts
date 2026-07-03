import { IBuilderTextModeParseResult } from '../types/builder-text-mode-parse-result';
import { IBuilderFieldProps } from '../../types';
import { IStrings } from '../../../constants/strings';
import { tryParseSql } from '../../../query-formats/sql/try-parse-sql';
import { validateBuilderSqlTextSemantics } from './validate-builder-sql-text-semantics';

interface IParseBuilderSqlTextOptions {
  allowGroupNegation?: boolean;
  allowFieldComparisons?: boolean;
}

export const parseBuilderSqlText = (
  value: string,
  fields: IBuilderFieldProps[],
  strings: IStrings,
  options: IParseBuilderSqlTextOptions = {}
): IBuilderTextModeParseResult => {
  const result = tryParseSql(value, strings.textMode);

  const semanticDiagnostics =
    result.parsedNodes && result.diagnostics.length === 0
      ? validateBuilderSqlTextSemantics(result.parsedNodes, fields, strings, options)
      : [];

  if (!result.data) {
    return {
      diagnostics: [...result.diagnostics, ...semanticDiagnostics],
    };
  }

  return {
    data: result.data,
    diagnostics: [...result.diagnostics, ...semanticDiagnostics],
  };
};

