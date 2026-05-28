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
import { Alert as DefaultAlert } from '../alert';
import { Button } from '../button';
import { strings as defaultStrings } from '../constants/strings';
import { DragPreview } from '../drag-preview';
import { createClonedSubtree } from '../history/create-cloned-subtree';
import { createInsertSubtreeAction } from '../history/create-insert-subtree-action';
import { createMoveNodeAction } from '../history/create-move-node-action';
import { createReplaceQueryAction } from '../history/create-replace-query-action';
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
import { TextModeBlockedAlertContainer } from './components/text-mode-blocked-alert-container';
import { useBuilderDragAndDrop } from './hooks/use-builder-drag-and-drop';
import { useBuilderHistory } from './hooks/use-builder-history';
import { useBuilderValidation } from './hooks/use-builder-validation';
import { TextModeEditor as DefaultTextModeEditor } from './text-mode/components/text-mode-editor';
import { formatBuilderSqlState } from './text-mode/utils/format-builder-sql-state';
import { hasBuilderTextModeLocks } from './text-mode/utils/has-builder-text-mode-locks';
import { normalizeBuilderTextModeQuery } from './text-mode/utils/normalize-builder-text-mode-query';
import { parseBuilderSqlText } from './text-mode/utils/parse-builder-sql-text';
import { reapplyBuilderTextModeLocks } from './text-mode/utils/reapply-builder-text-mode-locks';
import { resolveBuilderTextModeConfig } from './text-mode/utils/resolve-builder-text-mode-config';
import {
  IBuilderRef,
  IBuilderProps,
  IBuilderValidationResult,
} from './types';
import { createDefaultNodeIndex } from '../hooks/use-builder-ref/utils/create-default-node-index.util';
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
  newNodePlacement = 'append',
  validator,
  onStateChange,
  showValidation = false,
  history = false,
  onChange,
  textMode,
  defaultMode = 'builder',
}, ref) => {
  const textModeConfig = resolveBuilderTextModeConfig(textMode);
  const textModeConfigured = Boolean(textModeConfig) && singleRootGroup;
  const supportsLockedTextMode =
    (components.TextModeEditor || defaultComponents.TextModeEditor) !==
    defaultComponents.TextModeEditor;
  const initialTextModeBlockedByLocks =
    textModeConfigured && !supportsLockedTextMode && hasBuilderTextModeLocks(originalData);
  const initialTextModeEnabled =
    textModeConfigured && !initialTextModeBlockedByLocks;
  const initialEffectiveGroupTypes = initialTextModeEnabled
    ? 'with-modifiers'
    : groupTypes;
  const initialRootGroupType =
    initialEffectiveGroupTypes === 'without-modifiers'
      ? 'without-modifiers'
      : 'with-modifiers';
  const resolvedDefaultMode = defaultMode ?? textModeConfig?.defaultMode ?? 'builder';
  const theme = useTheme();
  const initialData = initialTextModeEnabled
    ? normalizeBuilderTextModeQuery(originalData)
    : originalData;
  const [data, setData] = useState<NormalizedQuery>(() =>
    ingestQuery(initialData, initialRootGroupType, singleRootGroup)
  );
  const [mode, setMode] = useState<'builder' | 'text'>(resolvedDefaultMode);
  const [textValue, setTextValue] = useState<string>(() => {
    if (!initialTextModeEnabled) {
      return '';
    }

    return formatBuilderSqlState(initialData, fields).value;
  });
  const [textProtectedRanges, setTextProtectedRanges] = useState<
    ReturnType<typeof formatBuilderSqlState>['protectedRanges']
  >(() => (initialTextModeEnabled ? formatBuilderSqlState(initialData, fields).protectedRanges : []));
  const [textErrorMessage, setTextErrorMessage] = useState<string | null>(null);
  const [textDiagnostics, setTextDiagnostics] = useState<
    ReturnType<typeof parseBuilderSqlText>['diagnostics']
  >([]);
  const lastEmittedData = useRef<DenormalizedQuery | null>(null);
  const pendingChangeData = useRef<NormalizedQuery | null>(null);
  const filteredData = data.filter((item) => !item.parent);
  const AddComponent = components.Add || Button;
  const AlertComponent = components.Alert || defaultComponents.Alert || DefaultAlert;
  const OutlinedButtonComponent =
    components.OutlinedButton || defaultComponents.OutlinedButton;
  const TextModeToggleContentComponent =
    components.TextModeToggleContent || defaultComponents.TextModeToggleContent;
  const TextModeEditorComponent =
    components.TextModeEditor || defaultComponents.TextModeEditor;
  const TextModeInputComponent =
    components.TextModeInput || defaultComponents.TextModeInput;
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

  const textModeBlockedByLocks =
    textModeConfigured && !supportsLockedTextMode && hasBuilderTextModeLocks(data);
  const textModeEnabled = textModeConfigured && !textModeBlockedByLocks;
  const effectiveGroupTypes = textModeEnabled ? 'with-modifiers' : groupTypes;
  const rootGroupType =
    effectiveGroupTypes === 'without-modifiers'
      ? 'without-modifiers'
      : 'with-modifiers';

  const validation = useBuilderValidation({
    data,
    originalData,
    fields,
    singleRootGroup,
    groupTypes: effectiveGroupTypes,
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
        const resolvedIndex =
          index ?? createDefaultNodeIndex(data, parentId, newNodePlacement);

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
        const resolvedIndex =
          index ?? createDefaultNodeIndex(data, parentId, newNodePlacement);

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
        const resolvedIndex =
          index ?? createDefaultNodeIndex(data, parentId, newNodePlacement);

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
    [commitData, data, historyState, newNodePlacement, redo, setHistory, undo]
  );

  useEffect(() => {
    if (!textModeEnabled) {
      setMode('builder');
      setTextProtectedRanges([]);
      setTextDiagnostics([]);
      setTextErrorMessage(null);
      return;
    }

    setMode(resolvedDefaultMode);
  }, [resolvedDefaultMode, textModeEnabled]);

  useEffect(() => {
    if (!textModeEnabled) {
      return;
    }

    const currentQuery = emitQuery(data);
    const normalizedQuery = normalizeBuilderTextModeQuery(currentQuery);

    if (isSameQuery(currentQuery, normalizedQuery)) {
      return;
    }

    pendingChangeData.current = null;
    lastEmittedData.current = null;
    resetHistory();
    setData(ingestQuery(normalizedQuery, rootGroupType, singleRootGroup));
  }, [data, resetHistory, rootGroupType, singleRootGroup, textModeEnabled]);

  useEffect(() => {
    if (!pendingChangeData.current || pendingChangeData.current !== data) {
      return;
    }

    const nextData = pendingChangeData.current;
    pendingChangeData.current = null;
    emitChange(nextData);
  }, [data, emitChange]);

  useEffect(() => {
    const compatibleOriginalData = textModeEnabled
      ? normalizeBuilderTextModeQuery(originalData)
      : originalData;

    if (
      lastEmittedData.current &&
      isSameQuery(lastEmittedData.current, compatibleOriginalData)
    ) {
      lastEmittedData.current = null;
      pendingChangeData.current = null;
      return;
    }

    pendingChangeData.current = null;
    resetHistory();
    setData(ingestQuery(compatibleOriginalData, rootGroupType, singleRootGroup));
  }, [originalData, resetHistory, rootGroupType, singleRootGroup, textModeEnabled]);

  useEffect(() => {
    if (!textModeEnabled) {
      return;
    }

    const nextTextState = formatBuilderSqlState(
      normalizeBuilderTextModeQuery(emitQuery(data)),
      fields
    );

    setTextValue(nextTextState.value);
    setTextProtectedRanges(nextTextState.protectedRanges);
    setTextDiagnostics([]);
    setTextErrorMessage(null);
  }, [data, fields, textModeEnabled]);

  const handleAddRootGroup = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('with-modifiers')],
        createDefaultNodeIndex(data, undefined, newNodePlacement) ?? filteredData.length
      )
    );
  }, [data, dispatchAction, filteredData.length, newNodePlacement]);

  const handleAddRootGroupWithoutModifiers = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('without-modifiers')],
        createDefaultNodeIndex(data, undefined, newNodePlacement) ?? filteredData.length
      )
    );
  }, [data, dispatchAction, filteredData.length, newNodePlacement]);

  const handleAddRootRule = useCallback(() => {
    const emptyRule: INormalizedRuleNode = {
      field: '',
      id: createId(),
    };

    dispatchAction(
      createInsertSubtreeAction(
        [emptyRule],
        createDefaultNodeIndex(data, undefined, newNodePlacement) ?? filteredData.length
      )
    );
  }, [data, dispatchAction, filteredData.length, newNodePlacement]);

  const handleSwitchToBuilderMode = useCallback(() => {
    setMode('builder');
  }, []);

  const handleSwitchToTextMode = useCallback(() => {
    const nextTextState = formatBuilderSqlState(
      normalizeBuilderTextModeQuery(emitQuery(data)),
      fields
    );

    setTextValue(nextTextState.value);
    setTextProtectedRanges(nextTextState.protectedRanges);
    setTextDiagnostics([]);
    setTextErrorMessage(null);
    setMode('text');
  }, [data, fields]);

  const handleTextChange = useCallback(
    (nextText: string) => {
      setTextValue(nextText);

      const parseResult = parseBuilderSqlText(nextText, fields, strings);

      if (!parseResult.data || parseResult.diagnostics.length > 0) {
        setTextDiagnostics(parseResult.diagnostics);
        setTextErrorMessage(
          parseResult.diagnostics[0]
            ? `${
                strings.textMode?.syntaxError || 'Syntax error'
              }: ${parseResult.diagnostics[0].message}`
            : null
        );
        return;
      }

      setTextDiagnostics([]);
      setTextErrorMessage(null);

      if (isSameQuery(parseResult.data, emitQuery(data))) {
        return;
      }

      const currentQuery = normalizeBuilderTextModeQuery(emitQuery(data));
      const nextQuery = hasBuilderTextModeLocks(currentQuery)
        ? reapplyBuilderTextModeLocks(currentQuery, parseResult.data)
        : parseResult.data;
      const nextData = ingestQuery(
        normalizeBuilderTextModeQuery(nextQuery),
        rootGroupType,
        singleRootGroup
      );
      commitData(createReplaceQueryAction(nextData));
    },
    [commitData, data, rootGroupType, singleRootGroup, strings.textMode]
  );

  const builderContent = (
    <Iterator
      originalData={data}
      filteredData={filteredData}
      activeDropZoneId={activeDropZoneId}
      activeDragId={activeDragId}
      isDragging={Boolean(activeDragId)}
      disableDropZoneTransition={isDropSettling}
    />
  );

  const content =
    textModeEnabled && mode === 'text' ? (
      TextModeEditorComponent === defaultComponents.TextModeEditor ? (
        <DefaultTextModeEditor
          value={textValue}
          diagnostics={textDiagnostics}
          protectedRanges={textProtectedRanges}
          protectedRangeHoverMessage={strings.textMode?.lockedRangesHover || null}
          errorMessage={textErrorMessage}
          TextModeInputComponent={TextModeInputComponent}
          readOnly={readOnly}
          onChange={handleTextChange}
        />
      ) : (
        <TextModeEditorComponent
          value={textValue}
          diagnostics={textDiagnostics}
          protectedRanges={textProtectedRanges}
          protectedRangeHoverMessage={strings.textMode?.lockedRangesHover || null}
          errorMessage={textErrorMessage}
          readOnly={readOnly}
          onChange={handleTextChange}
        />
      )
    ) : (
      builderContent
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
      groupTypes={effectiveGroupTypes}
      newNodePlacement={newNodePlacement}
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
        {textModeBlockedByLocks && strings.textMode?.locksUnsupported ? (
          <TextModeBlockedAlertContainer>
            <AlertComponent
              severity="warning"
              variant="outlined"
              data-test="TextModeBlockedAlert"
            >
              {strings.textMode.locksUnsupported}
            </AlertComponent>
          </TextModeBlockedAlertContainer>
        ) : null}
        <BuilderRootActions
          readOnly={readOnly}
          singleRootGroup={singleRootGroup}
          groupTypes={effectiveGroupTypes}
          strings={strings}
          isTextModeConfigured={textModeConfigured}
          isTextModeBlocked={textModeBlockedByLocks}
          mode={mode}
          showHistoryControls={showHistoryControls}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onSwitchToBuilderMode={handleSwitchToBuilderMode}
          onSwitchToTextMode={handleSwitchToTextMode}
          onAddRootRule={handleAddRootRule}
          onAddRootGroup={handleAddRootGroup}
          onAddRootGroupWithoutModifiers={handleAddRootGroupWithoutModifiers}
          AddComponent={AddComponent}
          OutlinedButtonComponent={OutlinedButtonComponent}
          TextModeToggleContentComponent={TextModeToggleContentComponent}
          PopoverComponent={PopoverComponent}
          PopoverItemComponent={PopoverItemComponent}
          HistoryControlsComponent={HistoryControlsComponent}
        />
        {draggable && !readOnly && (!textModeEnabled || mode !== 'text') ? (
          <DndContext {...dndContextProps}>
            {builderContent}
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
