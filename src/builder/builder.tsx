import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { BuilderContextProvider } from '../builder-context';
import { Button } from '../button';
import { strings as defaultStrings } from '../constants/strings';
import { DragPreview } from '../drag-preview';
import { createClonedSubtree } from '../history/create-cloned-subtree';
import { createInsertSubtreeAction } from '../history/create-insert-subtree-action';
import { createMoveNodeAction } from '../history/create-move-node-action';
import { createRemoveSubtreeAction } from '../history/create-remove-subtree-action';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { getNodePosition } from '../history/get-node-position';
import { Iterator } from '../iterator';
import { Popover } from '../popover';
import { PopoverItem } from '../popover-item';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { createGroupNode } from '../utils/create-group-node.util';
import { createId } from '../utils/create-id.util';
import { emitQuery } from '../utils/emit-query.util';
import { ingestQuery } from '../utils/ingest-query.util';
import { isSameQuery } from '../utils/is-same-query.util';
import { clone } from '../utils/clone.util';
import {
  DenormalizedQuery,
  INormalizedRuleNode,
  NormalizedQuery,
} from '../utils/query-tree';
import { defaultComponents } from './constants/default-components';
import { BuilderRootActions } from './components/builder-root-actions';
import { StyledBuilder } from './components/styled-builder';
import { useBuilderDragAndDrop } from './hooks/use-builder-drag-and-drop';
import { useBuilderHistory } from './hooks/use-builder-history';
import { useBuilderValidation } from './hooks/use-builder-validation';
import {
  IBuilderRef,
  IBuilderProps,
  IBuilderValidationResult,
} from './types';
import { createAppendNodeIndex } from '../hooks/use-builder-ref/utils/create-append-node-index.util';
import { resolveLockedNode } from '../hooks/use-builder-ref/utils/resolve-locked-node.util';

export const Builder = forwardRef<IBuilderRef, IBuilderProps>(({
  data: originalData = [],
  fields,
  components = defaultComponents,
  strings = defaultStrings,
  readOnly = false,
  lockable = false,
  cloneable = false,
  draggable = false,
  singleRootGroup = true,
  groupTypes = 'with-modifiers',
  validator,
  onStateChange,
  showValidation = false,
  history = false,
  onChange,
}, ref) => {
  const rootGroupType =
    groupTypes === 'without-modifiers' ? 'without-modifiers' : 'with-modifiers';
  const theme = useTheme();
  const [data, setData] = useState<NormalizedQuery>(() =>
    ingestQuery(originalData, rootGroupType, singleRootGroup)
  );
  const lastEmittedData = useRef<DenormalizedQuery | null>(null);
  const pendingChangeData = useRef<NormalizedQuery | null>(null);
  const filteredData = data.filter((item) => !item.parent);
  const AddComponent = components.Add || Button;
  const PopoverComponent = components.Popover || Popover;
  const PopoverItemComponent = components.PopoverItem || PopoverItem;
  const HistoryControlsComponent =
    components.HistoryControls || defaultComponents.HistoryControls;

  const {
    canRedo,
    canUndo,
    commitData,
    dispatchAction,
    historyState,
    redo,
    resetHistory,
    setHistory,
    showHistoryControls,
    undo,
  } = useBuilderHistory({
    data,
    setData: (nextData) => {
      const resolvedData =
        typeof nextData === 'function' ? nextData(data) : nextData;

      pendingChangeData.current = resolvedData;
      setData(resolvedData);
    },
    history,
  });

  const validation = useBuilderValidation({
    data,
    originalData,
    fields,
    singleRootGroup,
    groupTypes,
    strings,
    validator,
    onStateChange,
    canUndo,
    canRedo,
  });

  const { activeDragId, activeDropZoneId, dndContextProps, isDropSettling } =
    useBuilderDragAndDrop({
      draggable,
      readOnly,
      commitData,
    });

  const emitChange = useCallback(
    (nextData: NormalizedQuery) => {
      if (!onChange) {
        return;
      }

      try {
        const denormalizedData = emitQuery(nextData);
        lastEmittedData.current = denormalizedData;
        onChange(denormalizedData);
      } catch {
        throw new Error('Input data tree is in invalid format');
      }
    },
    [onChange]
  );

  useImperativeHandle(
    ref,
    (): IBuilderRef => ({
      cloneNode: (nodeId) => {
        const currentPosition = getNodePosition(data, nodeId);

        if (!currentPosition) {
          return false;
        }

        return commitData(
          createInsertSubtreeAction(
            createClonedSubtree(data, nodeId),
            currentPosition.index + 1,
            currentPosition.parentId
          )
        );
      },
      deleteNode: (nodeId) => commitData(createRemoveSubtreeAction(nodeId)),
      replaceNode: (nodeId, node) =>
        commitData(createReplaceNodeAction(nodeId, clone(node))),
      updateNode: (nodeId, updater) => {
        const currentNode = findNodeById(data, nodeId);

        if (!currentNode) {
          return false;
        }

        return commitData(
          createReplaceNodeAction(nodeId, clone(updater(clone(currentNode))))
        );
      },
      insertNodes: (nodes, index, parentId) =>
        commitData(createInsertSubtreeAction(clone(nodes), index, parentId)),
      addNode: (node, parentId, index) => {
        const resolvedIndex = index ?? createAppendNodeIndex(data, parentId);

        if (resolvedIndex === null) {
          return false;
        }

        return commitData(
          createInsertSubtreeAction(
            [{ ...clone(node), parent: parentId }],
            resolvedIndex,
            parentId
          )
        );
      },
      addGroup: (groupType = 'with-modifiers', parentId, index) => {
        const resolvedIndex = index ?? createAppendNodeIndex(data, parentId);

        if (resolvedIndex === null) {
          return false;
        }

        return commitData(
          createInsertSubtreeAction(
            [createGroupNode(groupType, parentId)],
            resolvedIndex,
            parentId
          )
        );
      },
      addRule: (rule = {}, parentId, index) => {
        const resolvedIndex = index ?? createAppendNodeIndex(data, parentId);

        if (resolvedIndex === null) {
          return false;
        }

        const nextRule: INormalizedRuleNode = {
          field: '',
          id: createId(),
          parent: parentId,
          ...clone(rule),
        };

        return commitData(
          createInsertSubtreeAction([nextRule], resolvedIndex, parentId)
        );
      },
      moveNode: (nodeId, index, parentId) =>
        commitData(createMoveNodeAction(nodeId, index, parentId)),
      setNodeLock: (nodeId, state) => {
        const currentNode = findNodeById(data, nodeId);

        if (!currentNode) {
          return false;
        }

        return commitData(
          createReplaceNodeAction(nodeId, resolveLockedNode(currentNode, state))
        );
      },
      lockNode: (nodeId, state = 'self') => {
        const currentNode = findNodeById(data, nodeId);

        if (!currentNode) {
          return false;
        }

        const resolvedState =
          'type' in currentNode && currentNode.type === 'GROUP'
            ? state
            : 'self';

        return commitData(
          createReplaceNodeAction(
            nodeId,
            resolveLockedNode(currentNode, resolvedState)
          )
        );
      },
      unlockNode: (nodeId) => {
        const currentNode = findNodeById(data, nodeId);

        if (!currentNode) {
          return false;
        }

        return commitData(
          createReplaceNodeAction(nodeId, resolveLockedNode(currentNode, 'unlocked'))
        );
      },
      getNodeById: (nodeId) => {
        const node = findNodeById(data, nodeId);
        return node ? clone(node) : undefined;
      },
      getNodes: () => clone(data),
      getData: () => emitQuery(data),
      getHistory: () => clone(historyState),
      setHistory,
      undo,
      redo,
    }),
    [commitData, data, historyState, redo, setHistory, undo]
  );

  useEffect(() => {
    if (!pendingChangeData.current || pendingChangeData.current !== data) {
      return;
    }

    const nextData = pendingChangeData.current;
    pendingChangeData.current = null;
    emitChange(nextData);
  }, [data, emitChange]);

  useEffect(() => {
    if (
      lastEmittedData.current &&
      isSameQuery(lastEmittedData.current, originalData)
    ) {
      lastEmittedData.current = null;
      pendingChangeData.current = null;
      return;
    }

    pendingChangeData.current = null;
    resetHistory();
    setData(ingestQuery(originalData, rootGroupType, singleRootGroup));
  }, [originalData, resetHistory, rootGroupType, singleRootGroup]);

  const handleAddRootGroup = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('with-modifiers')],
        filteredData.length
      )
    );
  }, [dispatchAction, filteredData.length]);

  const handleAddRootGroupWithoutModifiers = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('without-modifiers')],
        filteredData.length
      )
    );
  }, [dispatchAction, filteredData.length]);

  const handleAddRootRule = useCallback(() => {
    const emptyRule: INormalizedRuleNode = {
      field: '',
      id: createId(),
    };

    dispatchAction(createInsertSubtreeAction([emptyRule], filteredData.length));
  }, [dispatchAction, filteredData.length]);

  const content = (
    <Iterator
      originalData={data}
      filteredData={filteredData}
      activeDropZoneId={activeDropZoneId}
      activeDragId={activeDragId}
      isDragging={Boolean(activeDragId)}
      disableDropZoneTransition={isDropSettling}
    />
  );

  return (
    <BuilderContextProvider
      fields={fields}
      components={components}
      strings={strings}
      readOnly={readOnly}
      lockable={lockable}
      cloneable={cloneable}
      draggable={draggable}
      singleRootGroup={singleRootGroup}
      groupTypes={groupTypes}
      showValidation={showValidation}
      validation={validation as IBuilderValidationResult}
      data={data}
      dispatchAction={dispatchAction}
      history={{
        ...historyState,
        canUndo,
        canRedo,
        undo,
        redo,
      }}
    >
      <StyledBuilder $theme={theme}>
        <BuilderRootActions
          readOnly={readOnly}
          singleRootGroup={singleRootGroup}
          groupTypes={groupTypes}
          strings={strings}
          showHistoryControls={showHistoryControls}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onAddRootRule={handleAddRootRule}
          onAddRootGroup={handleAddRootGroup}
          onAddRootGroupWithoutModifiers={handleAddRootGroupWithoutModifiers}
          AddComponent={AddComponent}
          PopoverComponent={PopoverComponent}
          PopoverItemComponent={PopoverItemComponent}
          HistoryControlsComponent={HistoryControlsComponent}
        />
        {draggable && !readOnly ? (
          <DndContext {...dndContextProps}>
            {content}
            <DragOverlay dropAnimation={null}>
              {activeDragId ? (
                <DragPreview activeId={activeDragId} data={data} />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          content
        )}
      </StyledBuilder>
    </BuilderContextProvider>
  );
});

Builder.displayName = 'Builder';
