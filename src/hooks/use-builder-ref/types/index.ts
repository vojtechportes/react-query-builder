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
  isFieldInUse: (field: string) => boolean;
  getFieldOptionState: (field: string) => IBuilderFieldOptionState;
  setFieldOptions: (
    field: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setFieldOptionsStatus: (
    field: string,
    status: BuilderFieldOptionsStatus
  ) => void;
  invalidateFieldOptions: (field: string) => void;
  reloadFieldOptions: (field: string) => void;
  clearFieldOptions: (field: string) => void;
  getNodes: () => NormalizedQuery;
  getData: () => DenormalizedQuery;
  getHistory: () => IBuilderHistoryState;
  setHistory: (history: IBuilderHistoryState) => void;
  undo: () => void;
  redo: () => void;
}

export type BuilderRef = React.MutableRefObject<IBuilderRef | null>;
