export type QueryOperator =
  | 'LARGER'
  | 'SMALLER'
  | 'LARGER_EQUAL'
  | 'SMALLER_EQUAL'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'ALL_IN'
  | 'ANY_IN'
  | 'NOT_IN'
  | 'BETWEEN'
  | 'NOT_BETWEEN'
  | 'LIKE'
  | 'NOT_LIKE';

export type QueryGroupValue = 'AND' | 'OR';

export type QueryRuleValue = string | string[] | boolean;

export interface DenormalizedRuleNode {
  id?: string;
  parent?: string;
  field: string;
  value?: QueryRuleValue;
  operator?: QueryOperator;
  operators?: QueryOperator[];
}

export interface DenormalizedGroupNode {
  id?: string;
  parent?: string;
  type: 'GROUP';
  value: QueryGroupValue;
  isNegated: boolean;
  children: DenormalizedNode[];
}

export type DenormalizedNode = DenormalizedRuleNode | DenormalizedGroupNode;

export interface NormalizedRuleNode extends DenormalizedRuleNode {
  id: string;
  parent?: string;
}

export interface NormalizedGroupNode {
  id: string;
  parent?: string;
  type: 'GROUP';
  value: QueryGroupValue;
  isNegated: boolean;
  children: string[];
}

export type NormalizedNode = NormalizedRuleNode | NormalizedGroupNode;

export type DenormalizedQuery = DenormalizedNode[];
export type NormalizedQuery = NormalizedNode[];
