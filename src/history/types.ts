import { NormalizedNode, NormalizedQuery } from '../utils/query-tree';

export interface IInsertSubtreeAction {
  type: 'insert-subtree';
  parentId?: string;
  index: number;
  nodes: NormalizedQuery;
}

export interface IRemoveSubtreeAction {
  type: 'remove-subtree';
  nodeId: string;
}

export interface IReplaceNodeAction {
  type: 'replace-node';
  nodeId: string;
  node: NormalizedNode;
}

export interface IReplaceQueryAction {
  type: 'replace-query';
  data: NormalizedQuery;
}

export interface IMoveNodeAction {
  type: 'move-node';
  nodeId: string;
  parentId?: string;
  index: number;
}

export type BuilderHistoryAction =
  | IInsertSubtreeAction
  | IRemoveSubtreeAction
  | IReplaceNodeAction
  | IReplaceQueryAction
  | IMoveNodeAction;

export interface IBuilderHistoryEntry {
  undo: BuilderHistoryAction;
  redo: BuilderHistoryAction;
}

export interface IBuilderHistoryState {
  past: IBuilderHistoryEntry[];
  future: IBuilderHistoryEntry[];
}

export interface IBuilderHistoryConfig {
  maxEntries?: number;
  controls?: boolean;
}
