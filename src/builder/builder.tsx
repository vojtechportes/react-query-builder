import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { BuilderContextProvider } from '../builder-context';
import { Alert as DefaultAlert } from '../alert';
import { Button } from '../button';
import { strings as defaultStrings } from '../locales/en-us';
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
import { findReadOnlyNegationDiagnostic } from './text-mode/utils/find-read-only-negation-diagnostic.util';
import { findReadOnlyTargetDiagnostic } from './text-mode/utils/find-read-only-target-diagnostic.util';
import { IBuilderRef, IBuilderProps, IBuilderValidationResult } from './types';
import { createDefaultNodeIndex } from '../hooks/use-builder-ref/utils/create-default-node-index.util';
import { resolveLockedNode } from '../hooks/use-builder-ref/utils/resolve-locked-node.util';
import { isNodeDeletionProtected } from '../utils/is-node-deletion-protected.util';
import { createBuilderFieldOptionsStore } from './utils/create-builder-field-options-store.util';
import { getNearestFieldMatch } from './utils/get-nearest-field-match.util';
import { isBuilderFieldInUse } from './utils/is-builder-field-in-use.util';
import { canAddRuleForParent } from './utils/resolve-builder-field-usage.util';
import { resolveBuilderFieldOptionState } from './utils/resolve-builder-field-option-state.util';
import { resolveReconciledBuilderRuleValue } from './utils/resolve-reconciled-builder-rule-value.util';
import { removeQueryNegation } from '../utils/remove-query-negation.util';
import { removeNormalizedQueryNegation } from '../utils/remove-normalized-query-negation.util';

const tryFormatBuilderTextState = (
  data: DenormalizedQuery,
  fields: IBuilderProps['fields'],
  options?: Parameters<typeof formatBuilderSqlState>[2]
): {
  textState: ReturnType<typeof formatBuilderSqlState>;
  errorMessage: string | null;
} => {
  try {
    return {
      textState: formatBuilderSqlState(data, fields, options),
      errorMessage: null,
    };
  } catch (error) {
    return {
      textState: {
        value: '',
        protectedRanges: [],
      },
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Failed to format SQL text mode state.',
    };
  }
};

export const Builder = forwardRef<IBuilderRef, IBuilderProps>(
  (
    {
      data: originalData = [],
      fields,
      components = defaultComponents,
      strings = defaultStrings,
      readOnly = false,
      readOnlyProtectsDelete = true,
      lockable = false,
      cloneable = false,
      draggable = false,
      allowGroupNegation = true,
      allowFieldComparisons = false,
      singleRootGroup = true,
      groupTypes = 'with-modifiers',
      newNodePlacement = 'append',
      validator,
      onStateChange,
      onFieldOptionsReload,
      onRuleOptionsReload,
      onFieldChange,
      showValidation = false,
      history = false,
      onChange,
      textMode,
      defaultMode = 'builder',
    },
    ref
  ) => {
    const sanitizeDenormalizedQuery = useCallback(
      (query: DenormalizedQuery): DenormalizedQuery =>
        allowGroupNegation ? query : removeQueryNegation(query),
      [allowGroupNegation]
    );
    const sanitizeNormalizedQuery = useCallback(
      (query: NormalizedQuery): NormalizedQuery =>
        allowGroupNegation ? query : removeNormalizedQueryNegation(query),
      [allowGroupNegation]
    );
    const textModeConfig = resolveBuilderTextModeConfig(textMode);
    const textModeConfigured = Boolean(textModeConfig) && singleRootGroup;
    const supportsLockedTextMode =
      (components.TextModeEditor || defaultComponents.TextModeEditor) !==
      defaultComponents.TextModeEditor;
    const initialTextModeBlockedByLocks =
      textModeConfigured &&
      !supportsLockedTextMode &&
      hasBuilderTextModeLocks(originalData);
    const initialTextModeEnabled =
      textModeConfigured && !initialTextModeBlockedByLocks;
    const initialEffectiveGroupTypes = initialTextModeEnabled
      ? 'with-modifiers'
      : groupTypes;
    const initialRootGroupType =
      initialEffectiveGroupTypes === 'without-modifiers'
        ? 'without-modifiers'
        : 'with-modifiers';
    const resolvedDefaultMode =
      defaultMode ?? textModeConfig?.defaultMode ?? 'builder';
    const theme = useTheme();
    const compatibleOriginalData = useMemo(
      () => sanitizeDenormalizedQuery(originalData),
      [originalData, sanitizeDenormalizedQuery]
    );
    const initialData = initialTextModeEnabled
      ? normalizeBuilderTextModeQuery(compatibleOriginalData)
      : compatibleOriginalData;
    const initialFormattedTextState = initialTextModeEnabled
      ? tryFormatBuilderTextState(initialData, fields, {
          protectGroupDeletionBoundaries: readOnlyProtectsDelete,
        })
      : {
          textState: { value: '', protectedRanges: [] },
          errorMessage: null,
        };
    const [data, setData] = useState<NormalizedQuery>(() =>
      sanitizeNormalizedQuery(
        ingestQuery(initialData, initialRootGroupType, singleRootGroup)
      )
    );
    const [mode, setMode] = useState<'builder' | 'text'>(resolvedDefaultMode);
    const [textValue, setTextValue] = useState<string>(
      () => initialFormattedTextState.textState.value
    );
    const [textProtectedRanges, setTextProtectedRanges] = useState<
      ReturnType<typeof formatBuilderSqlState>['protectedRanges']
    >(() => initialFormattedTextState.textState.protectedRanges);
    const [textErrorMessage, setTextErrorMessage] = useState<string | null>(
      () => initialFormattedTextState.errorMessage
    );
    const [textDiagnostics, setTextDiagnostics] = useState<
      ReturnType<typeof parseBuilderSqlText>['diagnostics']
    >([]);
    const pendingLocalTextValue = useRef<string | null>(null);
    const lastEmittedData = useRef<DenormalizedQuery | null>(null);
    const pendingChangeData = useRef<NormalizedQuery | null>(null);
    const fieldOptionsStoreRef =
      useRef<ReturnType<typeof createBuilderFieldOptionsStore>>();

    if (!fieldOptionsStoreRef.current) {
      fieldOptionsStoreRef.current = createBuilderFieldOptionsStore();
    }
    const filteredData = data.filter((item) => !item.parent);
    const canAddRootRule = canAddRuleForParent(data, fields);
    const AddComponent = components.Add || Button;
    const AlertComponent =
      components.Alert || defaultComponents.Alert || DefaultAlert;
    const OutlinedButtonComponent =
      components.OutlinedButton || defaultComponents.OutlinedButton;
    const TextModeToggleContentComponent =
      components.TextModeToggleContent ||
      defaultComponents.TextModeToggleContent;
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
        const sanitizedData = sanitizeNormalizedQuery(resolvedData);

        pendingChangeData.current = sanitizedData;
        setData(sanitizedData);
      },
      history,
    });

    const textModeBlockedByLocks =
      textModeConfigured &&
      !supportsLockedTextMode &&
      hasBuilderTextModeLocks(data);
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
      allowGroupNegation,
      allowFieldComparisons,
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
          const denormalizedData = sanitizeDenormalizedQuery(
            emitQuery(nextData)
          );
          lastEmittedData.current = denormalizedData;
          onChange(denormalizedData);
        } catch {
          throw new Error('Input data tree is in invalid format');
        }
      },
      [onChange, sanitizeDenormalizedQuery]
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
        deleteNode: (nodeId) =>
          readOnlyProtectsDelete && isNodeDeletionProtected(data, nodeId)
            ? false
            : commitData(createRemoveSubtreeAction(nodeId)),
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
            valueSource: 'value',
            ...clone(rule),
          } as INormalizedRuleNode;

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
            createReplaceNodeAction(
              nodeId,
              resolveLockedNode(currentNode, state)
            )
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
            createReplaceNodeAction(
              nodeId,
              resolveLockedNode(currentNode, 'unlocked')
            )
          );
        },
        getNodeById: (nodeId) => {
          const node = findNodeById(data, nodeId);
          return node ? clone(node) : undefined;
        },
        getNearestField: (currentNodeId, targetFieldName) =>
          getNearestFieldMatch(data, currentNodeId, targetFieldName),
        isFieldInUse: (field) => isBuilderFieldInUse(data, field),
        getFieldOptionState: (field) =>
          resolveBuilderFieldOptionState(
            fields.find((fieldConfig) => fieldConfig.field === field),
            fieldOptionsStoreRef.current?.getFieldState(field)
          ),
        getRuleOptionState: (ruleId) => {
          const ruleNode = findNodeById(data, ruleId);
          const fieldConfig =
            ruleNode && !('children' in ruleNode)
              ? fields.find((fieldItem) => fieldItem.field === ruleNode.field)
              : undefined;

          return resolveBuilderFieldOptionState(
            fieldConfig,
            fieldConfig
              ? fieldOptionsStoreRef.current?.getFieldState(fieldConfig.field)
              : undefined,
            fieldOptionsStoreRef.current?.getRuleState(ruleId)
          );
        },
        subscribeToFieldOptionState: (field, listener) => {
          const emitState = () => {
            listener(
              resolveBuilderFieldOptionState(
                fields.find((fieldConfig) => fieldConfig.field === field),
                fieldOptionsStoreRef.current?.getFieldState(field)
              )
            );
          };

          emitState();

          return (
            fieldOptionsStoreRef.current?.subscribeField(field, emitState) ||
            (() => {})
          );
        },
        subscribeToRuleOptionState: (ruleId, listener) => {
          const emitState = () => {
            const ruleNode = findNodeById(data, ruleId);
            const fieldConfig =
              ruleNode && !('children' in ruleNode)
                ? fields.find((fieldItem) => fieldItem.field === ruleNode.field)
                : undefined;

            listener(
              resolveBuilderFieldOptionState(
                fieldConfig,
                fieldConfig
                  ? fieldOptionsStoreRef.current?.getFieldState(
                      fieldConfig.field
                    )
                  : undefined,
                fieldOptionsStoreRef.current?.getRuleState(ruleId)
              )
            );
          };

          emitState();

          return (
            fieldOptionsStoreRef.current?.subscribeRule(ruleId, emitState) ||
            (() => {})
          );
        },
        setFieldOptions: (field, options) => {
          fieldOptionsStoreRef.current?.setFieldOptions(field, options);
        },
        setRuleOptions: (ruleId, options) => {
          fieldOptionsStoreRef.current?.setRuleOptions(ruleId, options);
        },
        setFieldOptionsStatus: (field, status) => {
          fieldOptionsStoreRef.current?.setFieldStatus(field, status);
        },
        setRuleOptionsStatus: (ruleId, status) => {
          fieldOptionsStoreRef.current?.setRuleStatus(ruleId, status);
        },
        invalidateFieldOptions: (field) => {
          fieldOptionsStoreRef.current?.invalidateField(field);
        },
        reloadFieldOptions: (field) => {
          fieldOptionsStoreRef.current?.invalidateField(field);
          onFieldOptionsReload?.(field);
        },
        clearFieldOptions: (field) => {
          fieldOptionsStoreRef.current?.clearField(field);
        },
        invalidateRuleOptions: (ruleId) => {
          fieldOptionsStoreRef.current?.invalidateRule(ruleId);
        },
        reloadRuleOptions: (ruleId) => {
          fieldOptionsStoreRef.current?.invalidateRule(ruleId);
          onRuleOptionsReload?.(ruleId);
        },
        clearRuleOptions: (ruleId) => {
          fieldOptionsStoreRef.current?.clearRule(ruleId);
        },
        reconcileRuleValueWithOptions: (ruleId, config) => {
          const ruleNode = findNodeById(data, ruleId);

          if (!ruleNode || 'children' in ruleNode) {
            return false;
          }

          const fieldConfig = fields.find(
            (fieldItem) => fieldItem.field === ruleNode.field
          );

          if (
            !fieldConfig ||
            (fieldConfig.type !== 'LIST' && fieldConfig.type !== 'MULTI_LIST')
          ) {
            return false;
          }

          const optionState = resolveBuilderFieldOptionState(
            fieldConfig,
            fieldOptionsStoreRef.current?.getFieldState(fieldConfig.field),
            fieldOptionsStoreRef.current?.getRuleState(ruleId)
          );
          const nextValue = resolveReconciledBuilderRuleValue(
            fieldConfig.type,
            ruleNode.value,
            optionState.options,
            config
          );
          const valueChanged =
            Array.isArray(ruleNode.value) && Array.isArray(nextValue)
              ? ruleNode.value.length !== nextValue.length ||
                ruleNode.value.some(
                  (value, index) => value !== nextValue[index]
                )
              : ruleNode.value !== nextValue;

          if (!valueChanged) {
            return true;
          }

          return commitData(
            createReplaceNodeAction(ruleId, {
              ...ruleNode,
              valueSource: 'value',
              value: nextValue,
              valueField: undefined,
            })
          );
        },
        getNodes: () => clone(data),
        getData: () => sanitizeDenormalizedQuery(emitQuery(data)),
        getHistory: () => clone(historyState),
        setHistory,
        undo,
        redo,
      }),
      [
        commitData,
        data,
        fields,
        historyState,
        newNodePlacement,
        onFieldOptionsReload,
        onRuleOptionsReload,
        redo,
        sanitizeDenormalizedQuery,
        setHistory,
        undo,
      ]
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

      const currentQuery = sanitizeDenormalizedQuery(emitQuery(data));
      const normalizedQuery = normalizeBuilderTextModeQuery(currentQuery);

      if (isSameQuery(currentQuery, normalizedQuery)) {
        return;
      }

      pendingChangeData.current = null;
      lastEmittedData.current = null;
      resetHistory();
      setData(
        sanitizeNormalizedQuery(
          ingestQuery(normalizedQuery, rootGroupType, singleRootGroup)
        )
      );
    }, [
      data,
      resetHistory,
      rootGroupType,
      sanitizeDenormalizedQuery,
      sanitizeNormalizedQuery,
      singleRootGroup,
      textModeEnabled,
    ]);

    useEffect(() => {
      if (!pendingChangeData.current || pendingChangeData.current !== data) {
        return;
      }

      const nextData = pendingChangeData.current;
      pendingChangeData.current = null;
      emitChange(nextData);
    }, [data, emitChange]);

    useEffect(() => {
      const nextCompatibleOriginalData = textModeEnabled
        ? normalizeBuilderTextModeQuery(compatibleOriginalData)
        : compatibleOriginalData;

      if (
        lastEmittedData.current &&
        isSameQuery(lastEmittedData.current, nextCompatibleOriginalData)
      ) {
        lastEmittedData.current = null;
        pendingChangeData.current = null;
        return;
      }

      pendingChangeData.current = null;
      resetHistory();
      setData(
        sanitizeNormalizedQuery(
          ingestQuery(
            nextCompatibleOriginalData,
            rootGroupType,
            singleRootGroup
          )
        )
      );
    }, [
      compatibleOriginalData,
      resetHistory,
      rootGroupType,
      sanitizeNormalizedQuery,
      singleRootGroup,
      textModeEnabled,
    ]);

    useEffect(() => {
      if (!textModeEnabled) {
        pendingLocalTextValue.current = null;
        return;
      }

      if (mode === 'text' && pendingLocalTextValue.current !== null) {
        setTextValue(pendingLocalTextValue.current);
        setTextDiagnostics([]);
        setTextErrorMessage(null);
        pendingLocalTextValue.current = null;
        return;
      }

      const nextFormattedTextState = tryFormatBuilderTextState(
        normalizeBuilderTextModeQuery(
          sanitizeDenormalizedQuery(emitQuery(data))
        ),
        fields,
        {
          protectGroupDeletionBoundaries: readOnlyProtectsDelete,
        }
      );

      setTextValue(nextFormattedTextState.textState.value);
      setTextProtectedRanges(nextFormattedTextState.textState.protectedRanges);
      setTextDiagnostics([]);
      setTextErrorMessage(nextFormattedTextState.errorMessage);
    }, [
      data,
      fields,
      mode,
      readOnlyProtectsDelete,
      sanitizeDenormalizedQuery,
      textModeEnabled,
    ]);

    const handleAddRootGroup = useCallback(() => {
      dispatchAction(
        createInsertSubtreeAction(
          [createGroupNode('with-modifiers')],
          createDefaultNodeIndex(data, undefined, newNodePlacement) ??
            filteredData.length
        )
      );
    }, [data, dispatchAction, filteredData.length, newNodePlacement]);

    const handleAddRootGroupWithoutModifiers = useCallback(() => {
      dispatchAction(
        createInsertSubtreeAction(
          [createGroupNode('without-modifiers')],
          createDefaultNodeIndex(data, undefined, newNodePlacement) ??
            filteredData.length
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
          createDefaultNodeIndex(data, undefined, newNodePlacement) ??
            filteredData.length
        )
      );
    }, [data, dispatchAction, filteredData.length, newNodePlacement]);

    const handleSwitchToBuilderMode = useCallback(() => {
      setMode('builder');
    }, []);

    const handleSwitchToTextMode = useCallback(() => {
      const nextFormattedTextState = tryFormatBuilderTextState(
        normalizeBuilderTextModeQuery(
          sanitizeDenormalizedQuery(emitQuery(data))
        ),
        fields,
        {
          protectGroupDeletionBoundaries: readOnlyProtectsDelete,
        }
      );

      setTextValue(nextFormattedTextState.textState.value);
      setTextProtectedRanges(nextFormattedTextState.textState.protectedRanges);
      setTextDiagnostics([]);
      setTextErrorMessage(nextFormattedTextState.errorMessage);
      setMode('text');
    }, [data, fields, readOnlyProtectsDelete, sanitizeDenormalizedQuery]);

    const handleTextChange = useCallback(
      (nextText: string) => {
        setTextValue(nextText);

        const parseResult = parseBuilderSqlText(nextText, fields, strings, {
          allowGroupNegation,
          allowFieldComparisons,
        });
        const currentQuery = sanitizeDenormalizedQuery(emitQuery(data));
        const readOnlyTargetDiagnostic =
          parseResult.data && parseResult.diagnostics.length === 0
            ? findReadOnlyTargetDiagnostic(currentQuery, parseResult.data, {
                allowProtectedClauseRemoval: !readOnlyProtectsDelete,
              })
            : null;
        const readOnlyNegationDiagnostic =
          parseResult.data &&
          parseResult.diagnostics.length === 0 &&
          !readOnlyTargetDiagnostic
            ? findReadOnlyNegationDiagnostic(currentQuery, parseResult.data)
            : null;

        if (
          !parseResult.data ||
          parseResult.diagnostics.length > 0 ||
          readOnlyTargetDiagnostic ||
          readOnlyNegationDiagnostic
        ) {
          const diagnostics =
            readOnlyTargetDiagnostic || readOnlyNegationDiagnostic
              ? [
                  ...parseResult.diagnostics,
                  ...(readOnlyTargetDiagnostic
                    ? [readOnlyTargetDiagnostic]
                    : []),
                  ...(readOnlyNegationDiagnostic
                    ? [readOnlyNegationDiagnostic]
                    : []),
                ]
              : parseResult.diagnostics;

          setTextDiagnostics(diagnostics);
          setTextErrorMessage(
            diagnostics[0]
              ? `${
                  strings.textMode?.syntaxError || 'Syntax error'
                }: ${diagnostics[0].message}`
              : null
          );

          if (readOnlyTargetDiagnostic || readOnlyNegationDiagnostic) {
            setTextProtectedRanges((currentProtectedRanges) => [
              ...currentProtectedRanges,
            ]);
          }

          return;
        }

        setTextDiagnostics([]);
        setTextErrorMessage(null);

        if (isSameQuery(parseResult.data, currentQuery)) {
          return;
        }

        const normalizedCurrentQuery =
          normalizeBuilderTextModeQuery(currentQuery);
        const nextQuery = hasBuilderTextModeLocks(normalizedCurrentQuery)
          ? reapplyBuilderTextModeLocks(
              normalizedCurrentQuery,
              parseResult.data
            )
          : parseResult.data;
        const nextData = ingestQuery(
          normalizeBuilderTextModeQuery(sanitizeDenormalizedQuery(nextQuery)),
          rootGroupType,
          singleRootGroup
        );
        pendingLocalTextValue.current = nextText;
        commitData(createReplaceQueryAction(nextData));
      },
      [
        allowGroupNegation,
        allowFieldComparisons,
        commitData,
        data,
        readOnlyProtectsDelete,
        rootGroupType,
        sanitizeDenormalizedQuery,
        singleRootGroup,
        strings,
      ]
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
      textModeEnabled && mode === 'text'
        ? (() => {
            const textModeProtectedRanges = readOnly
              ? textValue.length > 0
                ? [{ start: 0, end: textValue.length }]
                : []
              : textProtectedRanges;

            return TextModeEditorComponent ===
              defaultComponents.TextModeEditor ? (
              <DefaultTextModeEditor
                value={textValue}
                diagnostics={textDiagnostics}
                protectedRanges={textModeProtectedRanges}
                protectedRangeHoverMessage={
                  strings.textMode?.lockedRangesHover || null
                }
                errorMessage={textErrorMessage}
                TextModeInputComponent={TextModeInputComponent}
                readOnly={readOnly}
                allowProtectedRangeDeletion={!readOnlyProtectsDelete}
                onChange={handleTextChange}
              />
            ) : (
              <TextModeEditorComponent
                value={textValue}
                diagnostics={textDiagnostics}
                protectedRanges={textModeProtectedRanges}
                protectedRangeHoverMessage={
                  strings.textMode?.lockedRangesHover || null
                }
                errorMessage={textErrorMessage}
                readOnly={readOnly}
                allowProtectedRangeDeletion={!readOnlyProtectsDelete}
                onChange={handleTextChange}
              />
            );
          })()
        : builderContent;

    return (
      <BuilderContextProvider
        fields={fields}
        components={components}
        strings={strings}
        fieldOptionsStore={fieldOptionsStoreRef.current}
        onFieldOptionsReload={onFieldOptionsReload}
        onRuleOptionsReload={onRuleOptionsReload}
        onFieldChange={onFieldChange}
        readOnly={readOnly}
        readOnlyProtectsDelete={readOnlyProtectsDelete}
        lockable={lockable}
        cloneable={cloneable}
        draggable={draggable}
        allowGroupNegation={allowGroupNegation}
        allowFieldComparisons={allowFieldComparisons}
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
            disableAddRootRule={!canAddRootRule}
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
  }
);

Builder.displayName = 'Builder';
