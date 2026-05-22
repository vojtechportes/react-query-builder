import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { BuilderContextProvider } from '../builder-context';
import { Button } from '../button';
import { strings as defaultStrings } from '../constants/strings';
import { DragPreview } from '../drag-preview';
import { createInsertSubtreeAction } from '../history/create-insert-subtree-action';
import { Iterator } from '../iterator';
import { Popover } from '../popover';
import { PopoverItem } from '../popover-item';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { createGroupNode } from '../utils/create-group-node.util';
import { createId } from '../utils/create-id.util';
import { emitQuery } from '../utils/emit-query.util';
import { ingestQuery } from '../utils/ingest-query.util';
import { isSameQuery } from '../utils/is-same-query.util';
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
  IBuilderProps,
  IBuilderValidationResult,
} from './types';

export const Builder: FC<IBuilderProps> = ({
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
}) => {
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
};
