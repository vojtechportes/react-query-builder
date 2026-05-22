import React from 'react';
import { IButtonProps } from '../../button';
import { ICloneButtonProps } from '../../clone-button';
import { IDropZoneProps } from '../../drop-zone';
import { IEmptyGroupDropZoneProps } from '../../empty-group-drop-zone';
import { IInputProps } from '../../form/input';
import { ISelectProps } from '../../form/select';
import { ISelectMultiProps } from '../../form/select-multi';
import { ISwitchProps } from '../../form/switch';
import { IGroupProps as IGroupContainerProps } from '../../group/group-container';
import { IOptionProps as IGroupHeaderOptionProps } from '../../group/option';
import { IBuilderHistoryConfig } from '../../history/types';
import { ILockToggleProps } from '../../lock-toggle';
import { IPopoverItemProps } from '../../popover-item';
import { IPopoverProps } from '../../popover';
import { IRuleProps as IRuleContainerProps } from '../../rule/rule-container';
import { Text } from '../../text';
import { IStrings } from '../../constants/strings';
import { BuilderLockState } from '../../utils/lock-state';
import {
  DenormalizedQuery,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';

export type BuilderGroupMode = 'with-modifiers' | 'without-modifiers' | 'both';

export type BuilderFieldType =
  | 'BOOLEAN'
  | 'TEXT'
  | 'DATE'
  | 'NUMBER'
  | 'STATEMENT'
  | 'LIST'
  | 'MULTI_LIST'
  | 'GROUP';

export type BuilderFieldOperator = QueryOperator;
export type BuilderGroupValues = QueryGroupValue;
export type { BuilderLockState };
export type {
  BuilderHistoryAction as IBuilderHistoryAction,
  IBuilderHistoryConfig,
  IBuilderHistoryState,
} from '../../history/types';

export type BuilderFieldValue =
  | string
  | number
  | string[]
  | number[]
  | boolean
  | Array<{ value: string | number; label: string }>;

export interface IBuilderValidationMessageContext {
  field: IBuilderFieldProps;
  operator?: BuilderFieldOperator;
  value?: BuilderFieldValue;
  ruleId?: string;
  rangeBoundary?: 'start' | 'end';
}

export type BuilderValidationMessage =
  | string
  | ((context: IBuilderValidationMessageContext) => string);

export interface IBuilderRangeValidation<
  TValueValidation = unknown,
  TRangeValue = string | number
> {
  common?: Partial<TValueValidation>;
  start?: Partial<TValueValidation>;
  end?: Partial<TValueValidation>;
  allowEqual?: boolean;
  requireAscending?: boolean;
  validate?: (
    range: [TRangeValue, TRangeValue],
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  message?: BuilderValidationMessage;
}

export interface IBuilderFieldValidationBase<TValue = unknown> {
  required?: boolean;
  oneOf?: TValue[];
  custom?: (
    value: TValue,
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  customMessage?: BuilderValidationMessage;
}

export interface ITextValueValidationRule
  extends IBuilderFieldValidationBase<string | string[]> {
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
}

export interface INumberValueValidationRule
  extends IBuilderFieldValidationBase<number | number[]> {
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}

export interface IDateValueValidationRule
  extends IBuilderFieldValidationBase<string | string[]> {
  minDate?: string | Date;
  maxDate?: string | Date;
}

export type IBooleanValueValidationRule = IBuilderFieldValidationBase<boolean>;
export type IListValueValidationRule =
  IBuilderFieldValidationBase<string | number>;

export interface IMultiListValueValidationRule
  extends IBuilderFieldValidationBase<Array<string | number>> {
  minItems?: number;
  maxItems?: number;
}

export type IStatementValueValidationRule =
  IBuilderFieldValidationBase<string> & {
    minLength?: number;
    maxLength?: number;
    matches?: RegExp;
  };

export type IBuilderOperatorValidationRule<TRule> = Partial<TRule> & {
  operators: BuilderFieldOperator[];
};

export interface IBuilderValidationConfig<TRule> {
  common?: Partial<TRule>;
  rules?: Array<IBuilderOperatorValidationRule<TRule>>;
}

export interface ITextFieldValidationRule extends ITextValueValidationRule {
  range?: IBuilderRangeValidation<ITextValueValidationRule, string>;
}

export interface INumberFieldValidationRule extends INumberValueValidationRule {
  range?: IBuilderRangeValidation<INumberValueValidationRule, number>;
}

export interface IDateFieldValidationRule extends IDateValueValidationRule {
  range?: IBuilderRangeValidation<IDateValueValidationRule, string>;
}

export type IStatementFieldValidationRule = IStatementValueValidationRule;
export type IBooleanFieldValidationRule = IBooleanValueValidationRule;
export type IListFieldValidationRule = IListValueValidationRule;
export type IMultiListFieldValidationRule = IMultiListValueValidationRule;

export type ITextFieldValidation =
  | Partial<ITextFieldValidationRule>
  | IBuilderValidationConfig<ITextFieldValidationRule>;

export type INumberFieldValidation =
  | Partial<INumberFieldValidationRule>
  | IBuilderValidationConfig<INumberFieldValidationRule>;

export type IDateFieldValidation =
  | Partial<IDateFieldValidationRule>
  | IBuilderValidationConfig<IDateFieldValidationRule>;

export type IBooleanFieldValidation =
  | Partial<IBooleanFieldValidationRule>
  | IBuilderValidationConfig<IBooleanFieldValidationRule>;

export type IListFieldValidation =
  | Partial<IListFieldValidationRule>
  | IBuilderValidationConfig<IListFieldValidationRule>;

export type IMultiListFieldValidation =
  | Partial<IMultiListFieldValidationRule>
  | IBuilderValidationConfig<IMultiListFieldValidationRule>;

export type IStatementFieldValidation =
  | Partial<IStatementFieldValidationRule>
  | IBuilderValidationConfig<IStatementFieldValidationRule>;

interface IBuilderFieldBase<
  TType extends BuilderFieldType,
  TValue extends BuilderFieldValue | undefined,
  TValidation
> {
  field: string;
  label: string;
  value?: TValue;
  type: TType;
  operators?: BuilderFieldOperator[];
  validation?: TValidation;
}

export type IBooleanFieldProps = IBuilderFieldBase<
  'BOOLEAN',
  boolean,
  IBooleanFieldValidation
>;

export type ITextFieldProps = IBuilderFieldBase<
  'TEXT',
  string,
  ITextFieldValidation
>;

export type IDateFieldProps = IBuilderFieldBase<
  'DATE',
  string,
  IDateFieldValidation
>;

export type INumberFieldProps = IBuilderFieldBase<
  'NUMBER',
  number,
  INumberFieldValidation
>;

export type IStatementFieldProps = IBuilderFieldBase<
  'STATEMENT',
  string,
  IStatementFieldValidation
>;

export type IListFieldProps = IBuilderFieldBase<
  'LIST',
  Array<{ value: string | number; label: string }>,
  IListFieldValidation
>;

export type IMultiListFieldProps = IBuilderFieldBase<
  'MULTI_LIST',
  Array<{ value: string | number; label: string }>,
  IMultiListFieldValidation
>;

export type IGroupFieldProps = IBuilderFieldBase<'GROUP', undefined, never>;

export type IBuilderFieldProps =
  | IBooleanFieldProps
  | ITextFieldProps
  | IDateFieldProps
  | INumberFieldProps
  | IStatementFieldProps
  | IListFieldProps
  | IMultiListFieldProps
  | IGroupFieldProps;

export type BuilderValidationSeverity = 'error' | 'warning';

export interface IBuilderValidationIssue {
  ruleId: string;
  field: string;
  message: string;
  severity?: BuilderValidationSeverity;
  code?: string;
}

export interface IBuilderValidationResult {
  isValid: boolean;
  issues: IBuilderValidationIssue[];
  issuesByRuleId: Record<string, IBuilderValidationIssue[]>;
}

export interface IBuilderValidationContext {
  fields: IBuilderFieldProps[];
  singleRootGroup: boolean;
  groupTypes: BuilderGroupMode;
  strings: IStrings;
}

export interface IBuilderValidator {
  (
    data: DenormalizedQuery,
    context: IBuilderValidationContext
  ): IBuilderValidationResult | Promise<IBuilderValidationResult>;
}

export interface IBuilderStateChange {
  data: DenormalizedQuery;
  isValid: boolean;
  validation: IBuilderValidationResult;
  canUndo: boolean;
  canRedo: boolean;
}

export interface IHistoryControlsProps {
  undoButton: React.ReactNode;
  redoButton: React.ReactNode;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}

export interface IBuilderComponentsProps {
  form?: {
    Select?: React.ComponentType<ISelectProps>;
    SelectMulti?: React.ComponentType<ISelectMultiProps>;
    Switch?: React.ComponentType<ISwitchProps>;
    Input?: React.ComponentType<IInputProps>;
  };
  Remove?: React.ComponentType<IButtonProps>;
  Add?: React.ComponentType<IButtonProps>;
  CloneButton?: React.ComponentType<ICloneButtonProps>;
  LockToggle?: React.ComponentType<ILockToggleProps>;
  HistoryControls?: React.ComponentType<IHistoryControlsProps>;
  Rule?: React.ComponentType<IRuleContainerProps>;
  Group?: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption?: React.ComponentType<IGroupHeaderOptionProps>;
  Text?: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone?: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone?: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover?: React.ComponentType<IPopoverProps>;
  PopoverItem?: React.ComponentType<IPopoverItemProps>;
}

export interface IResolvedBuilderComponentsProps {
  form: {
    Select: React.ComponentType<ISelectProps>;
    SelectMulti: React.ComponentType<ISelectMultiProps>;
    Switch: React.ComponentType<ISwitchProps>;
    Input: React.ComponentType<IInputProps>;
  };
  Remove: React.ComponentType<IButtonProps>;
  Add: React.ComponentType<IButtonProps>;
  CloneButton: React.ComponentType<ICloneButtonProps>;
  LockToggle: React.ComponentType<ILockToggleProps>;
  HistoryControls: React.ComponentType<IHistoryControlsProps>;
  Rule: React.ComponentType<IRuleContainerProps>;
  Group: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption: React.ComponentType<IGroupHeaderOptionProps>;
  Text: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover: React.ComponentType<IPopoverProps>;
  PopoverItem: React.ComponentType<IPopoverItemProps>;
}

export interface IBuilderProps {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
  components?: IBuilderComponentsProps;
  strings?: IStrings;
  readOnly?: boolean;
  lockable?: boolean;
  cloneable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  showValidation?: boolean;
  history?: boolean | IBuilderHistoryConfig;
  onChange?: (data: DenormalizedQuery) => any;
}

export type { BuilderRef, IBuilderRef } from '../../hooks/use-builder-ref/types';
