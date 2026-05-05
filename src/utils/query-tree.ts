import { QueryOperator } from './query-operators';

export type { QueryOperator } from './query-operators';

export type QueryGroupValue = 'AND' | 'OR';
export type QueryGroupType = 'with-modifiers' | 'without-modifiers';
export type GroupReadOnly = boolean | IGroupReadOnlyConfig;

export type QueryRuleValue =
  | string
  | number
  | string[]
  | number[]
  | boolean;

export interface IGroupReadOnlyConfig {
  enabled: boolean;
  inheritToChildren?: boolean;
}

export interface IDenormalizedRuleNode {
  id?: string;
  parent?: string;
  field: string;
  value?: QueryRuleValue;
  operator?: QueryOperator;
  operators?: QueryOperator[];
  readOnly?: boolean;
}

export interface IDenormalizedGroupNodeBase {
  id?: string;
  parent?: string;
  type: 'GROUP';
  children: DenormalizedNode[];
  readOnly?: GroupReadOnly;
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
  readOnly?: GroupReadOnly;
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
