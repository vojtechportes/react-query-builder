import React from 'react';
import {
  INormalizedRuleNode,
  NormalizedNode,
  NormalizedQuery,
  QueryGroupType,
  DenormalizedQuery,
} from '../../../utils/query-tree';
import {
  BuilderFieldOption,
  BuilderFieldOptionsStatus,
  IBuilderFieldOptionState,
  INearestFieldMatch,
  IBuilderRuleDependencyEntry,
  IBuilderRuleValueReconciliationConfig,
} from '../../../builder/types/field-option';
import { IBuilderHistoryState } from '../../../history/types';

export interface IBuilderRef {
  cloneNode: (nodeId: string) => boolean;
  deleteNode: (nodeId: string) => boolean;
  replaceNode: (nodeId: string, node: NormalizedNode) => boolean;
  updateNode: (
    nodeId: string,
    updater: (node: NormalizedNode) => NormalizedNode
  ) => boolean;
  insertNodes: (
    nodes: NormalizedQuery,
    index: number,
    parentId?: string
  ) => boolean;
  addNode: (node: NormalizedNode, parentId?: string, index?: number) => boolean;
  addGroup: (
    groupType?: QueryGroupType,
    parentId?: string,
    index?: number
  ) => boolean;
  addRule: (
    rule?: Partial<INormalizedRuleNode>,
    parentId?: string,
    index?: number
  ) => boolean;
  moveNode: (nodeId: string, index: number, parentId?: string) => boolean;
  setNodeLock: (
    nodeId: string,
    state: 'unlocked' | 'self' | 'all'
  ) => boolean;
  lockNode: (nodeId: string, state?: 'self' | 'all') => boolean;
  unlockNode: (nodeId: string) => boolean;
  getNodeById: (nodeId: string) => NormalizedNode | undefined;
  getNearestField: (
    currentNodeId: string,
    targetFieldName: string
  ) => INearestFieldMatch | undefined;
  isFieldInUse: (field: string) => boolean;
  getFieldOptionState: (field: string) => IBuilderFieldOptionState;
  getRuleOptionState: (ruleId: string) => IBuilderFieldOptionState;
  subscribeToFieldOptionState: (
    field: string,
    listener: BuilderFieldOptionStateListener
  ) => () => void;
  subscribeToRuleOptionState: (
    ruleId: string,
    listener: BuilderFieldOptionStateListener
  ) => () => void;
  setFieldOptions: (
    field: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setRuleOptions: (
    ruleId: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setFieldOptionsStatus: (
    field: string,
    status: BuilderFieldOptionsStatus
  ) => void;
  setRuleOptionsStatus: (
    ruleId: string,
    status: BuilderFieldOptionsStatus
  ) => void;
  invalidateFieldOptions: (field: string) => void;
  reloadFieldOptions: (field: string) => void;
  clearFieldOptions: (field: string) => void;
  invalidateRuleOptions: (ruleId: string) => void;
  reloadRuleOptions: (ruleId: string) => void;
  clearRuleOptions: (ruleId: string) => void;
  reconcileRuleValueWithOptions: (
    ruleId: string,
    config: IBuilderRuleValueReconciliationConfig
  ) => boolean;
  getNodes: () => NormalizedQuery;
  getData: () => DenormalizedQuery;
  getHistory: () => IBuilderHistoryState;
  setHistory: (history: IBuilderHistoryState) => void;
  undo: () => void;
  redo: () => void;
}

export type BuilderRefListener = (builder: IBuilderRef | null) => void;
export type BuilderRuleDependenciesListener = (
  entries: IBuilderRuleDependencyEntry[]
) => void;
export type BuilderFieldDependenciesListener = BuilderRuleDependenciesListener;
export interface IBuilderRuleOptionsResolverContext {
  ruleId: string;
  field: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
  signal: AbortSignal;
}

export interface IBuilderRuleOptionsErrorContext {
  ruleId: string;
  field: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
}

export interface IBuilderRuleOptionsResolvedContext {
  ruleId: string;
  field: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
  options: BuilderFieldOption[];
}

export interface IBuilderRuleOptionsBindingConfig {
  dependencies: string[];
  resolve: (
    context: IBuilderRuleOptionsResolverContext
  ) => Promise<BuilderFieldOption[]>;
  onError?: (
    error: unknown,
    context: IBuilderRuleOptionsErrorContext
  ) => void;
  onOptionsResolved?: (
    context: IBuilderRuleOptionsResolvedContext
  ) => void;
  clearOnMissingDependencies?: boolean;
}
export type BuilderFieldOptionStateListener = (
  state: IBuilderFieldOptionState
) => void;

export type BuilderRef = React.MutableRefObject<IBuilderRef | null> & {
  subscribe: (listener: BuilderRefListener) => () => void;
  bindRuleOptions: (
    field: string,
    config: IBuilderRuleOptionsBindingConfig
  ) => () => void;
  subscribeToRuleDependencies: (
    field: string,
    dependencyFields: string[],
    listener: BuilderRuleDependenciesListener
  ) => () => void;
  subscribeToFieldDependencies: (
    field: string,
    dependencyFields: string[],
    listener: BuilderFieldDependenciesListener
  ) => () => void;
  subscribeToFieldOptionState: (
    field: string,
    listener: BuilderFieldOptionStateListener
  ) => () => void;
  subscribeToRuleOptionState: (
    ruleId: string,
    listener: BuilderFieldOptionStateListener
  ) => () => void;
  reconcileRuleValueWithOptions: (
    ruleId: string,
    config: IBuilderRuleValueReconciliationConfig
  ) => boolean;
};
