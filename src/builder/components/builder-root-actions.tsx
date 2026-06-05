import React, { FC } from 'react';
import { IButtonProps } from '../../button';
import { IStrings } from '../../constants/strings';
import { IPopoverItemProps } from '../../popover-item';
import { IPopoverProps } from '../../popover';
import { BuilderGroupMode, IHistoryControlsProps } from '../types';
import { RootControls } from './root-controls';
import { ITextModeToggleContentProps, TextModeToggleContent } from './text-mode-toggle-content';

export interface IBuilderRootActionsProps {
  readOnly: boolean;
  singleRootGroup: boolean;
  groupTypes: BuilderGroupMode;
  strings: IStrings;
  isTextModeConfigured?: boolean;
  isTextModeBlocked?: boolean;
  mode?: 'builder' | 'text';
  showHistoryControls: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSwitchToBuilderMode?: () => void;
  onSwitchToTextMode?: () => void;
  onAddRootRule: () => void;
  disableAddRootRule?: boolean;
  onAddRootGroup: () => void;
  onAddRootGroupWithoutModifiers: () => void;
  AddComponent: React.ComponentType<IButtonProps>;
  OutlinedButtonComponent: React.ComponentType<IButtonProps>;
  TextModeToggleContentComponent?: React.ComponentType<ITextModeToggleContentProps>;
  PopoverComponent: React.ComponentType<IPopoverProps>;
  PopoverItemComponent: React.ComponentType<IPopoverItemProps>;
  HistoryControlsComponent: React.ComponentType<IHistoryControlsProps>;
}

export const BuilderRootActions: FC<IBuilderRootActionsProps> = ({
  readOnly,
  singleRootGroup,
  groupTypes,
  strings,
  isTextModeConfigured = false,
  isTextModeBlocked = false,
  mode = 'builder',
  showHistoryControls,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSwitchToBuilderMode,
  onSwitchToTextMode,
  onAddRootRule,
  disableAddRootRule = false,
  onAddRootGroup,
  onAddRootGroupWithoutModifiers,
  AddComponent,
  OutlinedButtonComponent,
  TextModeToggleContentComponent = TextModeToggleContent,
  PopoverComponent,
  PopoverItemComponent,
  HistoryControlsComponent,
}) => {
  const shouldRender =
    ((!readOnly && strings.group && !singleRootGroup) ||
      showHistoryControls ||
      isTextModeConfigured);

  if (!shouldRender) {
    return null;
  }

  const undoButton =
    showHistoryControls && strings.history ? (
      <OutlinedButtonComponent
        onClick={onUndo}
        disabled={!canUndo}
        data-test="Undo"
      >
        {strings.history.undo}
      </OutlinedButtonComponent>
    ) : null;

  const redoButton =
    showHistoryControls && strings.history ? (
      <OutlinedButtonComponent
        onClick={onRedo}
        disabled={!canRedo}
        data-test="Redo"
      >
        {strings.history.redo}
      </OutlinedButtonComponent>
    ) : null;

  const handleModeToggle =
    mode === 'text'
      ? onSwitchToBuilderMode || (() => {})
      : onSwitchToTextMode || (() => {});

  const modeToggleLabel =
    mode === 'text'
      ? strings.textMode?.toggleToBuilder
      : strings.textMode?.toggleToText;
  const textModeBlockedMessage = strings.textMode?.locksUnsupported;

  return (
    <RootControls>
      {isTextModeConfigured && modeToggleLabel ? (
        <OutlinedButtonComponent
          onClick={handleModeToggle}
          disabled={isTextModeBlocked}
          title={isTextModeBlocked ? textModeBlockedMessage : undefined}
          data-test="TextModeToggle"
        >
          <TextModeToggleContentComponent mode={mode} label={modeToggleLabel} />
        </OutlinedButtonComponent>
      ) : null}
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
          <AddComponent
            onClick={onAddRootRule}
            disabled={disableAddRootRule}
            data-test="AddRootRule"
          >
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
