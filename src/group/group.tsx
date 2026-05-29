import React, { FC, useContext } from 'react';
import { BuilderGroupValues, BuilderLockState } from '../builder';
import { BuilderContext } from '../builder-context';
import { Button } from '../button';
import { CloneButton as DefaultCloneButton } from '../clone-button';
import { createClonedSubtree } from '../history/create-cloned-subtree';
import { createInsertSubtreeAction } from '../history/create-insert-subtree-action';
import { createRemoveSubtreeAction } from '../history/create-remove-subtree-action';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { getNodePosition } from '../history/get-node-position';
import { LockToggle as DefaultLockToggle } from '../lock-toggle';
import { Popover as DefaultPopover } from '../popover';
import { PopoverItem as DefaultPopoverItem } from '../popover-item';
import { SecondaryButton } from '../secondary-button';
import { createGroupNode } from '../utils/create-group-node.util';
import { createId } from '../utils/create-id.util';
import { getCloneButtonTitle } from '../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../utils/get-lock-toggle-title.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import {
  GroupReadOnlyTarget,
  INormalizedRuleNode,
  NormalizedNode,
} from '../utils/query-tree';
import { createDefaultNodeIndex } from '../hooks/use-builder-ref/utils/create-default-node-index.util';
import { Group as DefaultGroupContainer } from './group-container';
import { Option as DefaultOption } from './option';
import { isNodeDeletionProtected } from '../utils/is-node-deletion-protected.util';
import { updateGroupLockState } from '../utils/read-only/update-group-lock-state.util';

export interface IGroupProps {
  value?: BuilderGroupValues;
  isNegated?: boolean;
  children?: React.ReactNode;
  dragHandle?: React.ReactNode;
  contentOverlay?: React.ReactNode;
  id: string;
  isRoot: boolean;
  readOnly?: boolean;
  readOnlyTargets?: GroupReadOnlyTarget[];
  lockState?: BuilderLockState;
  lockDisabled?: boolean;
}

export const Group: FC<IGroupProps> = ({
  value,
  isNegated,
  children,
  dragHandle,
  contentOverlay,
  id,
  isRoot,
  readOnly: localReadOnly = false,
  readOnlyTargets = [],
  lockState = localReadOnly ? 'self' : 'unlocked',
  lockDisabled = false,
}) => {
  const {
    components,
    data,
    dispatchAction,
    strings,
    readOnly,
    readOnlyProtectsDelete = true,
    cloneable,
    lockable,
    groupTypes,
    singleRootGroup,
    newNodePlacement = 'append',
  } = useContext(BuilderContext);
  const isReadOnly = readOnly || localReadOnly;
  const Add = components.Add || Button;
  const CloneButton = components.CloneButton || DefaultCloneButton;
  const GroupContainer = components.Group || DefaultGroupContainer;
  const LockToggle = components.LockToggle || DefaultLockToggle;
  const Option = components.GroupHeaderOption || DefaultOption;
  const Popover = components.Popover || DefaultPopover;
  const PopoverItem = components.PopoverItem || DefaultPopoverItem;
  const Remove = components.Remove || SecondaryButton;
  const resolvedGroupTypes = groupTypes || 'with-modifiers';
  const canDeleteGroup =
    !(singleRootGroup && isRoot) &&
    !isReadOnly &&
    readOnlyTargets.length === 0 &&
    (!readOnlyProtectsDelete || !isNodeDeletionProtected(data, id));
  const canCloneGroup = !(singleRootGroup && isRoot) && !isReadOnly;
  const isNegationReadOnly =
    isReadOnly || readOnlyTargets.includes('negation');
  const isCombinatorReadOnly =
    isReadOnly || readOnlyTargets.includes('combinator');

  const addItem = (payload: NormalizedNode) => {
    const currentGroup = data.find((item) => item.id === id);

    if (!dispatchAction || !currentGroup || !isNormalizedGroupNode(currentGroup)) {
      return;
    }

    dispatchAction(
      createInsertSubtreeAction(
        [payload],
        createDefaultNodeIndex(data, id, newNodePlacement) ??
          currentGroup.children.length,
        id
      )
    );
  };

  const handleAddGroup = () => {
    addItem(createGroupNode('with-modifiers', id));
  };

  const handleAddGroupWithoutModifiers = () => {
    addItem(createGroupNode('without-modifiers', id));
  };

  const handleAddRule = () => {
    const emptyRule: INormalizedRuleNode = {
      field: '',
      id: createId(),
      parent: id,
    };

    addItem(emptyRule);
  };

  const handleChangeGroupType = (nextValue: BuilderGroupValues) => {
    const currentGroup = data.find((item) => item.id === id);

    if (
      !dispatchAction ||
      !currentGroup ||
      !isNormalizedGroupNode(currentGroup) ||
      isCombinatorReadOnly ||
      typeof currentGroup.value === 'undefined' ||
      typeof currentGroup.isNegated === 'undefined'
    ) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentGroup,
        value: nextValue,
      })
    );
  };

  const handleToggleNegateGroup = (nextValue: boolean) => {
    const currentGroup = data.find((item) => item.id === id);

    if (
      !dispatchAction ||
      !currentGroup ||
      !isNormalizedGroupNode(currentGroup) ||
      isNegationReadOnly ||
      typeof currentGroup.value === 'undefined' ||
      typeof currentGroup.isNegated === 'undefined'
    ) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentGroup,
        isNegated: nextValue,
      })
    );
  };

  const handleDeleteGroup = () => {
    if (!canDeleteGroup) {
      return;
    }

    dispatchAction?.(createRemoveSubtreeAction(id));
  };

  const handleCloneGroup = () => {
    const currentPosition = getNodePosition(data, id);

    if (!dispatchAction || !currentPosition) {
      return;
    }

    dispatchAction(
      createInsertSubtreeAction(
        createClonedSubtree(data, id),
        currentPosition.index + 1,
        currentPosition.parentId
      )
    );
  };

  const handleChangeLockState = (nextState: BuilderLockState) => {
    const currentGroup = data.find((item) => item.id === id);

    if (!dispatchAction || !currentGroup || !isNormalizedGroupNode(currentGroup)) {
      return;
    }

    const nextGroup = { ...currentGroup };
    const nextReadOnly = updateGroupLockState(currentGroup.readOnly, nextState);

    if (typeof nextReadOnly === 'undefined') {
      delete nextGroup.readOnly;
    } else {
      nextGroup.readOnly = nextReadOnly;
    }

    dispatchAction(createReplaceNodeAction(id, nextGroup));
  };

  if (!strings.group) {
    return null;
  }

  const hasModifiers =
    typeof value !== 'undefined' && typeof isNegated !== 'undefined';

  const addGroupControl =
    resolvedGroupTypes === 'both' ? (
      <Popover
        label={strings.group.addGroup || 'Add Group'}
        data-test="AddGroup"
      >
        <PopoverItem
          label={strings.group.addGroupWithModifiers || 'With Modifiers'}
          onClick={handleAddGroup}
          data-test="AddGroupWithModifiers"
        />
        <PopoverItem
          label={strings.group.addGroupWithoutModifiers || 'Without Modifiers'}
          onClick={handleAddGroupWithoutModifiers}
          data-test="AddGroupWithoutModifiers"
        />
      </Popover>
    ) : (
      <Add
        onClick={
          resolvedGroupTypes === 'without-modifiers'
            ? handleAddGroupWithoutModifiers
            : handleAddGroup
        }
        data-test="AddGroup"
      >
        {strings.group.addGroup}
      </Add>
    );

  const lockControl =
    lockable && !readOnly ? (
      <LockToggle
        state={lockState}
        nodeType="group"
        disabled={lockDisabled}
        onChange={handleChangeLockState}
        title={getLockToggleTitle(strings, 'group', lockState)}
        data-test="LockToggle[group]"
      />
    ) : null;

  const cloneControl =
    cloneable && canCloneGroup ? (
      <CloneButton
        nodeType="group"
        onClick={handleCloneGroup}
        title={getCloneButtonTitle(strings, 'group')}
        data-test="CloneButton[group]"
      />
    ) : null;

  return (
    <GroupContainer
      dragHandle={dragHandle}
      contentOverlay={contentOverlay}
      controlsLeft={
        hasModifiers ? (
          <>
            <Option
              isSelected={Boolean(isNegated)}
              value={!isNegated}
              disabled={isNegationReadOnly}
              onClick={handleToggleNegateGroup}
              data-test="Option[not]"
            >
              {strings.group.not}
            </Option>
            <Option
              isSelected={value === 'AND'}
              value="AND"
              disabled={isCombinatorReadOnly}
              onClick={handleChangeGroupType}
              data-test="Option[and]"
            >
              {strings.group.and}
            </Option>
            <Option
              isSelected={value === 'OR'}
              value="OR"
              disabled={isCombinatorReadOnly}
              onClick={handleChangeGroupType}
              data-test="Option[or]"
            >
              {strings.group.or}
            </Option>
          </>
        ) : null
      }
      controlsRight={
        <>
          {!isReadOnly && (
            <>
              <Add onClick={handleAddRule} data-test="AddRule">
                {strings.group.addRule}
              </Add>
              {addGroupControl}
            </>
          )}
          {canDeleteGroup ? (
            <Remove onClick={handleDeleteGroup} data-test="Remove">
              {strings.group.delete}
            </Remove>
          ) : null}
          {cloneControl}
          {lockControl}
        </>
      }
    >
      {children}
    </GroupContainer>
  );
};
