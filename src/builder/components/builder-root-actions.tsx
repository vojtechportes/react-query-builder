import React, { FC } from 'react';
import { IButtonProps } from '../../button';
import { IStrings } from '../../constants/strings';
import { IPopoverItemProps } from '../../popover-item';
import { IPopoverProps } from '../../popover';
import { BuilderGroupMode, IHistoryControlsProps } from '../types';
import { HistoryButton } from './history-button';
import { RootControls } from './root-controls';

export interface IBuilderRootActionsProps {
  readOnly: boolean;
  singleRootGroup: boolean;
  groupTypes: BuilderGroupMode;
  strings: IStrings;
  showHistoryControls: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddRootRule: () => void;
  onAddRootGroup: () => void;
  onAddRootGroupWithoutModifiers: () => void;
  AddComponent: React.ComponentType<IButtonProps>;
  PopoverComponent: React.ComponentType<IPopoverProps>;
  PopoverItemComponent: React.ComponentType<IPopoverItemProps>;
  HistoryControlsComponent: React.ComponentType<IHistoryControlsProps>;
}

export const BuilderRootActions: FC<IBuilderRootActionsProps> = ({
  readOnly,
  singleRootGroup,
  groupTypes,
  strings,
  showHistoryControls,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddRootRule,
  onAddRootGroup,
  onAddRootGroupWithoutModifiers,
  AddComponent,
  PopoverComponent,
  PopoverItemComponent,
  HistoryControlsComponent,
}) => {
  const shouldRender =
    ((!readOnly && strings.group && !singleRootGroup) || showHistoryControls);

  if (!shouldRender) {
    return null;
  }

  const undoButton =
    showHistoryControls && strings.history ? (
      <HistoryButton
        onClick={onUndo}
        disabled={!canUndo}
        data-test="Undo"
      >
        {strings.history.undo}
      </HistoryButton>
    ) : null;

  const redoButton =
    showHistoryControls && strings.history ? (
      <HistoryButton
        onClick={onRedo}
        disabled={!canRedo}
        data-test="Redo"
      >
        {strings.history.redo}
      </HistoryButton>
    ) : null;

  return (
    <RootControls>
      {undoButton && redoButton ? (
        <HistoryControlsComponent
          undoButton={undoButton}
          redoButton={redoButton}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
        />
      ) : null}
      {!readOnly && strings.group && !singleRootGroup ? (
        <>
          <AddComponent onClick={onAddRootRule} data-test="AddRootRule">
            {strings.group.addRule}
          </AddComponent>
          {groupTypes === 'both' ? (
            <PopoverComponent
              label={strings.group.addGroup || 'Add Group'}
              data-test="AddRootGroup"
            >
              <PopoverItemComponent
                label={strings.group.addGroupWithModifiers || 'With Modifiers'}
                onClick={onAddRootGroup}
                data-test="AddRootGroupWithModifiers"
              />
              <PopoverItemComponent
                label={
                  strings.group.addGroupWithoutModifiers || 'Without Modifiers'
                }
                onClick={onAddRootGroupWithoutModifiers}
                data-test="AddRootGroupWithoutModifiers"
              />
            </PopoverComponent>
          ) : (
            <AddComponent
              onClick={
                groupTypes === 'without-modifiers'
                  ? onAddRootGroupWithoutModifiers
                  : onAddRootGroup
              }
              data-test="AddRootGroup"
            >
              {strings.group.addGroup}
            </AddComponent>
          )}
        </>
      ) : null}
    </RootControls>
  );
};
