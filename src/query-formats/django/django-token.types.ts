import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type DjangoTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'COMMA'
  | 'AMP'
  | 'PIPE'
  | 'TILDE'
  | 'EQUAL'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'EOF';

export interface IDjangoToken {
  type: DjangoTokenType;
  value: string;
}

export interface IParsedDjangoGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedDjangoNode[];
}

export type ParsedDjangoNode = IDenormalizedRuleNode | IParsedDjangoGroup;

export const DJANGO_KEYWORDS = new Set(['Q', 'True', 'False', 'None']);

export const djangoOperatorOrder: QueryOperator[] = [
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
