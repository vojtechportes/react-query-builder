import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type JsonataTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'LBRACE'
  | 'RBRACE'
  | 'COMMA'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'VARIABLE'
  | 'FUNCTION'
  | 'REGEX'
  | 'KEYWORD'
  | 'EOF';

export interface IJsonataToken {
  type: JsonataTokenType;
  value: string;
}

export interface IParsedJsonataGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedJsonataNode[];
}

export type ParsedJsonataNode = IDenormalizedRuleNode | IParsedJsonataGroup;

export const JSONATA_KEYWORDS = new Set([
  'and',
  'or',
  'in',
  'null',
  'true',
  'false',
  'function',
]);

export const jsonataOperatorOrder: QueryOperator[] = [
  'EQUAL',
  'NOT_EQUAL',
  'LARGER',
  'LARGER_EQUAL',
  'SMALLER',
  'SMALLER_EQUAL',
  'IN',
  'NOT_IN',
  'ALL_IN',
  'ANY_IN',
  'BETWEEN',
  'NOT_BETWEEN',
  'IS_NULL',
  'IS_NOT_NULL',
  'LIKE',
  'NOT_LIKE',
  'CONTAINS',
  'NOT_CONTAINS',
  'STARTS_WITH',
  'ENDS_WITH',
];

