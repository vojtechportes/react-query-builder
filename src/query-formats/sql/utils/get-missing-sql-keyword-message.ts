import type { IStrings } from '../../../locales/types/strings';
import { getSqlParserString } from './get-sql-parser-string';

export const getMissingSqlKeywordMessage = (
  value: string,
  textModeStrings?: IStrings['textMode']
): string => {
  switch (value) {
    case 'AND':
      return getSqlParserString(
        textModeStrings,
        'missingAndKeyword',
        'Missing AND keyword.'
      );
    case 'OR':
      return getSqlParserString(
        textModeStrings,
        'missingOrKeyword',
        'Missing OR keyword.'
      );
    case 'NOT':
      return getSqlParserString(
        textModeStrings,
        'missingNotKeyword',
        'Missing NOT keyword.'
      );
    case 'IN':
      return getSqlParserString(
        textModeStrings,
        'missingInKeyword',
        'Missing IN keyword.'
      );
    case 'LIKE':
      return getSqlParserString(
        textModeStrings,
        'missingLikeKeyword',
        'Missing LIKE keyword.'
      );
    case 'IS':
      return getSqlParserString(
        textModeStrings,
        'missingIsKeyword',
        'Missing IS keyword.'
      );
    case 'NULL':
      return getSqlParserString(
        textModeStrings,
        'missingNullKeyword',
        'Missing NULL keyword.'
      );
    case 'BETWEEN':
      return getSqlParserString(
        textModeStrings,
        'missingBetweenKeyword',
        'Missing BETWEEN keyword.'
      );
    default:
      return getSqlParserString(
        textModeStrings,
        'missingKeyword',
        `Missing keyword "${value}".`,
        { keyword: value }
      );
  }
};
