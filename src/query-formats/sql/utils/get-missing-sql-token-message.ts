import type { IStrings } from '../../../locales/types/strings';
import { getSqlParserString } from './get-sql-parser-string';

export const getMissingSqlTokenMessage = (
  type: string,
  textModeStrings?: IStrings['textMode']
): string => {
  switch (type) {
    case 'RPAREN':
      return getSqlParserString(
        textModeStrings,
        'missingClosingParenthesis',
        'Missing closing parenthesis.'
      );
    case 'LPAREN':
      return getSqlParserString(
        textModeStrings,
        'missingOpeningParenthesis',
        'Missing opening parenthesis.'
      );
    case 'COMMA':
      return getSqlParserString(
        textModeStrings,
        'missingComma',
        'Missing comma.'
      );
    case 'OPERATOR':
      return getSqlParserString(
        textModeStrings,
        'missingSqlOperator',
        'Missing SQL operator.'
      );
    case 'IDENTIFIER':
      return getSqlParserString(
        textModeStrings,
        'missingFieldIdentifier',
        'Missing field identifier.'
      );
    case 'STRING':
      return getSqlParserString(
        textModeStrings,
        'missingStringValue',
        'Missing string value.'
      );
    case 'NUMBER':
      return getSqlParserString(
        textModeStrings,
        'missingNumericValue',
        'Missing numeric value.'
      );
    default:
      return getSqlParserString(
        textModeStrings,
        'missingToken',
        `Missing token "${type}".`,
        { token: type }
      );
  }
};
