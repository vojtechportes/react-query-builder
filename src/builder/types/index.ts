import React from 'react';
import type { IBuilderStyle } from './builder-style';
import type { IBuilderFieldProps } from '../../shared/builder-components/types';
export type * from '../../shared/builder-components/types';
import { IAlertProps } from '../../alert';
import { IButtonProps } from '../../button';
import { ICloneButtonProps } from '../../clone-button';
import { IDropZoneProps } from '../../drop-zone';
import { IEmptyGroupDropZoneProps } from '../../empty-group-drop-zone';
import { IInputProps } from '../../form/input';
import { ISelectProps } from '../../form/select';
import { ISelectMultiProps } from '../../form/select-multi';
import { ISwitchProps } from '../../form/switch';
import { IGroupProps as IGroupContainerProps } from '../../group/components/group-container';
import { IOptionProps as IGroupHeaderOptionProps } from '../../group/components/option';
import { IBuilderHistoryConfig } from '../../history/types';
import { ILockToggleProps } from '../../lock-toggle';
import { IPopoverItemProps } from '../../popover-item';
import { IPopoverProps } from '../../popover';
import { IRuleProps as IRuleContainerProps } from '../../rule/rule-container';
import { Text } from '../../text';
import type { IStrings } from '../../shared/localization/types/strings';
import { BuilderLockState } from '../../utils/lock-state';
import { BuilderDefaultMode } from './builder-default-mode';
import type { IBuilderFieldChange } from './field-option';
import { IBuilderTextModeConfig } from '../text-mode/types/builder-text-mode-config';
import { ITextModeEditorProps } from '../text-mode/types/text-mode-editor-props';
import { ITextModeInputProps } from '../text-mode/types/text-mode-input-props';
import { ITextModeToggleContentProps } from '../text-mode/components/text-mode-toggle-content';
import {
  DenormalizedQuery,
  GroupReadOnlyTarget,
  QueryGroupValue,
  RuleReadOnlyTarget,
} from '../../shared/query/model/types/query-tree';

export type BuilderGroupMode = 'with-modifiers' | 'without-modifiers' | 'both';
export type BuilderNewNodePlacement = 'append' | 'prepend';
export type { BuilderDefaultMode } from './builder-default-mode';

export type BuilderGroupValues = QueryGroupValue;
export type { BuilderLockState };
export type { GroupReadOnlyTarget, RuleReadOnlyTarget };
export type {
  BuilderFieldOption,
  BuilderFieldOptionsStatus,
  BuilderRuleValueReconciliationStrategy,
  IBuilderRuleDependencyEntry,
  IBuilderFieldDependencyEntry,
  IBuilderFieldChange,
  IBuilderFieldOptionState,
  IBuilderRuleValueReconciliationConfig,
  INearestFieldMatch,
} from './field-option';
export type { IAlertProps, AlertSeverity, AlertVariant } from '../../alert';
export type { IBuilderTextModeConfig } from '../text-mode/types/builder-text-mode-config';
export type { ITextModeEditorProps } from '../text-mode/types/text-mode-editor-props';
export type { ITextModeInputProps } from '../text-mode/types/text-mode-input-props';
export type { ITextModeProtectedRange } from '../text-mode/types/text-mode-protected-range';
export type { ITextModeToggleContentProps } from '../text-mode/components/text-mode-toggle-content';
export type {
  BuilderHistoryAction as IBuilderHistoryAction,
  IBuilderHistoryConfig,
  IBuilderHistoryState,
} from '../../history/types';

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
  allowGroupNegation: boolean;
  allowFieldComparisons: boolean;
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
  Alert?: React.ComponentType<IAlertProps>;
  form?: {
    Select?: React.ComponentType<ISelectProps>;
    SelectMulti?: React.ComponentType<ISelectMultiProps>;
    Switch?: React.ComponentType<ISwitchProps>;
    Input?: React.ComponentType<IInputProps>;
  };
  Remove?: React.ComponentType<IButtonProps>;
  Add?: React.ComponentType<IButtonProps>;
  OutlinedButton?: React.ComponentType<IButtonProps>;
  TextModeToggleContent?: React.ComponentType<ITextModeToggleContentProps>;
  TextModeEditor?: React.ComponentType<ITextModeEditorProps>;
  TextModeInput?: React.ComponentType<ITextModeInputProps>;
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
  Alert: React.ComponentType<IAlertProps>;
  form: {
    Select: React.ComponentType<ISelectProps>;
    SelectMulti: React.ComponentType<ISelectMultiProps>;
    Switch: React.ComponentType<ISwitchProps>;
    Input: React.ComponentType<IInputProps>;
  };
  Remove: React.ComponentType<IButtonProps>;
  Add: React.ComponentType<IButtonProps>;
  OutlinedButton: React.ComponentType<IButtonProps>;
  TextModeToggleContent: React.ComponentType<ITextModeToggleContentProps>;
  TextModeEditor: React.ComponentType<ITextModeEditorProps>;
  TextModeInput: React.ComponentType<ITextModeInputProps>;
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
  className?: string;
  style?: IBuilderStyle;
  components?: IBuilderComponentsProps;
  strings?: IStrings;
  textMode?: boolean | IBuilderTextModeConfig;
  defaultMode?: BuilderDefaultMode;
  readOnly?: boolean;
  readOnlyProtectsDelete?: boolean;
  lockable?: boolean;
  cloneable?: boolean;
  draggable?: boolean;
  allowGroupNegation?: boolean;
  allowFieldComparisons?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  newNodePlacement?: BuilderNewNodePlacement;
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  onFieldOptionsReload?: (field: string) => void;
  onRuleOptionsReload?: (ruleId: string) => void;
  onFieldChange?: (change: IBuilderFieldChange) => void;
  showValidation?: boolean;
  history?: boolean | IBuilderHistoryConfig;
  onChange?: (data: DenormalizedQuery) => any;
}

export type { IBuilderStyle } from './builder-style';

export type {
  BuilderFieldOptionStateListener,
  IBuilderRuleOptionsBindingConfig,
  IBuilderRuleOptionsErrorContext,
  IBuilderRuleOptionsResolvedContext,
  IBuilderRuleOptionsResolverContext,
  BuilderRuleDependenciesListener,
  BuilderRef,
  BuilderFieldDependenciesListener,
  BuilderRefListener,
  IBuilderRef,
} from '../../hooks/use-builder-ref/types';
