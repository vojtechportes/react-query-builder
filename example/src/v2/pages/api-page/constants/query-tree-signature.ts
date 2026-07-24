export const queryTreeSignature = `export type QueryGroupValue = 'AND' | 'OR';
export type QueryGroupType = 'with-modifiers' | 'without-modifiers';
export type GroupReadOnlyTarget = 'negation' | 'combinator';
export type RuleReadOnlyTarget = 'field' | 'operator' | 'value';
export type QueryRuleValueSource = 'value' | 'field';

export interface IGroupReadOnlyConfig {
  enabled: boolean;
  targets?: GroupReadOnlyTarget[];
  inheritToChildren?: boolean;
}

export interface IRuleReadOnlyConfig {
  enabled: boolean;
  targets?: RuleReadOnlyTarget[];
}

export type QueryRuleValue =
  | string
  | number
  | string[]
  | number[]
  | boolean;

export interface ILiteralRuleNode {
  id?: string;
  parent?: string;
  field: string;
  valueSource?: 'value';
  value?: QueryRuleValue;
  valueField?: undefined;
  operator?: QueryOperator;
  operators?: QueryOperator[];
  readOnly?: boolean | IRuleReadOnlyConfig;
}

export interface IFieldReferenceRuleNode {
  id?: string;
  parent?: string;
  field: string;
  valueSource: 'field';
  value?: undefined;
  valueField: string;
  operator?: QueryOperator;
  operators?: QueryOperator[];
  readOnly?: boolean | IRuleReadOnlyConfig;
}

export type IDenormalizedRuleNode = ILiteralRuleNode | IFieldReferenceRuleNode;

export interface IDenormalizedGroupNodeBase {
  id?: string;
  parent?: string;
  type: 'GROUP';
  children: DenormalizedNode[];
  readOnly?: boolean | IGroupReadOnlyConfig;
}

export type DenormalizedQuery = DenormalizedNode[];`;
