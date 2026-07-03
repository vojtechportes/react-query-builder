import { QueryOperator } from './query-operators';

export type { QueryOperator } from './query-operators';

export type QueryGroupValue = 'AND' | 'OR';
export type QueryGroupType = 'with-modifiers' | 'without-modifiers';
export type GroupReadOnly = boolean | IGroupReadOnlyConfig;
export type RuleReadOnly = boolean | IRuleReadOnlyConfig;
export type GroupReadOnlyTarget = 'negation' | 'combinator';
export type RuleReadOnlyTarget = 'field' | 'operator' | 'value';
export type QueryRuleValueSource = 'value' | 'field';

export type QueryRuleValue =
  | string
  | number
  | string[]
  | number[]
  | boolean;

export interface IGroupReadOnlyConfig {
  enabled: boolean;
  targets?: GroupReadOnlyTarget[];
  inheritToChildren?: boolean;
}

export interface IRuleReadOnlyConfig {
  enabled: boolean;
  targets?: RuleReadOnlyTarget[];
}

interface IRuleNodeBase {
  id?: string;
  parent?: string;
  field: string;
  operator?: QueryOperator;
  operators?: QueryOperator[];
  readOnly?: RuleReadOnly;
}

export interface ILiteralRuleNode extends IRuleNodeBase {
  valueSource?: 'value';
  value?: QueryRuleValue;
  valueField?: undefined;
}

export interface IFieldReferenceRuleNode extends IRuleNodeBase {
  valueSource: 'field';
  value?: undefined;
  valueField: string;
}

export type IDenormalizedRuleNode = ILiteralRuleNode | IFieldReferenceRuleNode;

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

interface INormalizedRuleNodeBase extends IRuleNodeBase {
  id: string;
  parent?: string;
}

export interface INormalizedLiteralRuleNode extends INormalizedRuleNodeBase {
  valueSource?: 'value';
  value?: QueryRuleValue;
  valueField?: undefined;
}

export interface INormalizedFieldReferenceRuleNode
  extends INormalizedRuleNodeBase {
  valueSource: 'field';
  value?: undefined;
  valueField: string;
}

export type INormalizedRuleNode =
  | INormalizedLiteralRuleNode
  | INormalizedFieldReferenceRuleNode;

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
