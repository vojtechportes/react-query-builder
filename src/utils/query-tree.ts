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
export type QueryGroupType = 'with-modifiers' | 'without-modifiers';

export type QueryRuleValue = string | string[] | boolean;

export interface IDenormalizedRuleNode {
  id?: string;
  parent?: string;
  field: string;
  value?: QueryRuleValue;
  operator?: QueryOperator;
  operators?: QueryOperator[];
}

export interface IDenormalizedGroupNodeBase {
  id?: string;
  parent?: string;
  type: 'GROUP';
  children: DenormalizedNode[];
}

export interface IDenormalizedGroupNodeWithModifiers
  extends IDenormalizedGroupNodeBase {
  value: QueryGroupValue;
  isNegated: boolean;
}

export interface IDenormalizedGroupNodeWithoutModifiers
  extends IDenormalizedGroupNodeBase {
  value?: undefined;
  isNegated?: undefined;
}

export type DenormalizedGroupNode =
  | IDenormalizedGroupNodeWithModifiers
  | IDenormalizedGroupNodeWithoutModifiers;

export type DenormalizedNode = IDenormalizedRuleNode | DenormalizedGroupNode;

export interface INormalizedRuleNode extends IDenormalizedRuleNode {
  id: string;
  parent?: string;
}

export interface INormalizedGroupNodeBase {
  id: string;
  parent?: string;
  type: 'GROUP';
  children: string[];
}

export interface INormalizedGroupNodeWithModifiers
  extends INormalizedGroupNodeBase {
  value: QueryGroupValue;
  isNegated: boolean;
}

export interface INormalizedGroupNodeWithoutModifiers
  extends INormalizedGroupNodeBase {
  value?: undefined;
  isNegated?: undefined;
}

export type NormalizedGroupNode =
  | INormalizedGroupNodeWithModifiers
  | INormalizedGroupNodeWithoutModifiers;

export type NormalizedNode = INormalizedRuleNode | NormalizedGroupNode;

export type DenormalizedQuery = DenormalizedNode[];
export type NormalizedQuery = NormalizedNode[];
