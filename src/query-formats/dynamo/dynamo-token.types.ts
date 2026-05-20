import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type DynamoTokenType =
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'EOF';

export interface IDynamoToken {
  type: DynamoTokenType;
  value: string;
}

export interface IParsedDynamoGroup {
  kind: 'group';
  combinator: QueryGroupValue;
  isNegated: boolean;
  children: ParsedDynamoNode[];
}

export type ParsedDynamoNode = IDenormalizedRuleNode | IParsedDynamoGroup;

export const DYNAMO_KEYWORDS = new Set([
  'AND',
  'OR',
  'NOT',
  'IN',
  'BETWEEN',
  'attribute_exists',
  'attribute_not_exists',
  'contains',
  'begins_with',
  'true',
  'false',
  'null',
]);

export const dynamoOperatorOrder: QueryOperator[] = [
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
