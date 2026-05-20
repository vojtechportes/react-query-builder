import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type RsqlTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'SEMICOLON'
  | 'OPERATOR'
  | 'STRING'
  | 'VALUE'
  | 'EOF';

export interface IRsqlToken {
  type: RsqlTokenType;
  value: string;
}

export interface IParsedRsqlGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedRsqlNode[];
}

export type ParsedRsqlNode = IDenormalizedRuleNode | IParsedRsqlGroup;

export const rsqlOperatorOrder: QueryOperator[] = [
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
