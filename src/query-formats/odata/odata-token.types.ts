import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type ODataTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'EOF';

export interface IODataToken {
  type: ODataTokenType;
  value: string;
}

export interface IParsedODataGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedODataNode[];
}

export type ParsedODataNode = IDenormalizedRuleNode | IParsedODataGroup;

export const ODATA_KEYWORDS = new Set([
  'and',
  'or',
  'not',
  'eq',
  'ne',
  'gt',
  'ge',
  'lt',
  'le',
  'null',
  'true',
  'false',
  '$filter',
]);

export const odataOperatorOrder: QueryOperator[] = [
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
