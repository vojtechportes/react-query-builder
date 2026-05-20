import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type TokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'EOF';

export interface IToken {
  type: TokenType;
  value: string;
}

export interface IParsedGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedNode[];
}

export type ParsedNode = IDenormalizedRuleNode | IParsedGroup;

export const SQL_KEYWORDS = new Set([
  'AND',
  'OR',
  'NOT',
  'IN',
  'LIKE',
  'IS',
  'NULL',
  'BETWEEN',
  'TRUE',
  'FALSE',
  'WHERE',
  'ORDER',
  'BY',
  'GROUP',
  'LIMIT',
  'OFFSET',
  'HAVING',
]);

export const SQL_STOP_CLAUSES = new Set([
  'ORDER',
  'GROUP',
  'LIMIT',
  'OFFSET',
  'HAVING',
]);

export const sqlOperatorOrder: QueryOperator[] = [
  'EQUAL',
  'NOT_EQUAL',
  'LARGER',
  'LARGER_EQUAL',
  'SMALLER',
  'SMALLER_EQUAL',
  'IN',
  'NOT_IN',
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

