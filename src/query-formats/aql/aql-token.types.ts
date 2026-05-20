import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type AqlTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'COMMA'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'EOF';

export interface IAqlToken {
  type: AqlTokenType;
  value: string;
}

export interface IParsedAqlGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedAqlNode[];
}

export type ParsedAqlNode = IDenormalizedRuleNode | IParsedAqlGroup;

export const AQL_KEYWORDS = new Set([
  'AND',
  'OR',
  'NOT',
  'IN',
  'LIKE',
  'NULL',
  'TRUE',
  'FALSE',
  'FILTER',
  'FOR',
  'RETURN',
  'SORT',
  'LIMIT',
  'LET',
  'ALL',
]);

export const aqlOperatorOrder: QueryOperator[] = [
  'EQUAL',
  'NOT_EQUAL',
  'LARGER',
  'LARGER_EQUAL',
  'SMALLER',
  'SMALLER_EQUAL',
  'IN',
  'NOT_IN',
  'ALL_IN',
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

