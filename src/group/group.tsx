import React, { FC, useContext } from 'react';
import { BuilderGroupValues } from '../builder';
import { BuilderContext } from '../builder-context';
import { Button } from '../button';
import { Popover as DefaultPopover } from '../popover';
import { PopoverItem as DefaultPopoverItem } from '../popover-item';
import { Group as DefaultGroupContainer } from './group-container';
import { Option as DefaultOption } from './option';
import { SecondaryButton } from '../secondary-button';
import { appendToGroup } from '../utils/append-to-group.util';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createGroupNode } from '../utils/create-group-node.util';
import { createId } from '../utils/create-id.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { NormalizedNode, INormalizedRuleNode } from '../utils/query-tree';
import { removeItem } from '../utils/remove-item.util';
import { updateItem } from '../utils/update-item.util';

export interface IGroupProps {
  value?: BuilderGroupValues;
  isNegated?: boolean;
  children?: React.ReactNode;
  dragHandle?: React.ReactNode;
  contentOverlay?: React.ReactNode;
  id: string;
  isRoot: boolean;
  readOnly?: boolean;
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
}) => {
  const {
    components,
    data,
    setData,
    onChange,
    updateData,
    strings,
    readOnly,
    groupTypes,
    singleRootGroup,
  } = useContext(BuilderContext);
  const isReadOnly = readOnly || localReadOnly;
  const Add = components.Add || Button;
  const GroupContainer = components.Group || DefaultGroupContainer;
  const Option = components.GroupHeaderOption || DefaultOption;
  const Popover = components.Popover || DefaultPopover;
  const PopoverItem = components.PopoverItem || DefaultPopoverItem;
  const Remove = components.Remove || SecondaryButton;
  const resolvedGroupTypes = groupTypes || 'with-modifiers';
  const canDeleteGroup = !(singleRootGroup && isRoot) && !isReadOnly;

  const addItem = (payload: NormalizedNode) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      (currentData) => appendToGroup(currentData, id, payload),
      updateData
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
    applyDataUpdate(
      data,
      setData,
      onChange,
      (currentData) =>
        updateItem(currentData, id, (item) => {
          if (isNormalizedGroupNode(item)) {
            item.value = nextValue;
          }
        }),
      updateData
    );
  };

  const handleToggleNegateGroup = (nextValue: boolean) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      (currentData) =>
        updateItem(currentData, id, (item) => {
          if (isNormalizedGroupNode(item)) {
            item.isNegated = nextValue;
          }
        }),
      updateData
    );
  };

  const handleDeleteGroup = () => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      (currentData) => removeItem(currentData, id),
      updateData
    );
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
              disabled={isReadOnly}
              onClick={handleToggleNegateGroup}
              data-test="Option[not]"
            >
              {strings.group.not}
            </Option>
            <Option
              isSelected={value === 'AND'}
              value="AND"
              disabled={isReadOnly}
              onClick={handleChangeGroupType}
              data-test="Option[and]"
            >
              {strings.group.and}
            </Option>
            <Option
              isSelected={value === 'OR'}
              value="OR"
              disabled={isReadOnly}
              onClick={handleChangeGroupType}
              data-test="Option[or]"
            >
              {strings.group.or}
            </Option>
          </>
        ) : null
      }
      controlsRight={
        !isReadOnly && (
          <>
            <Add onClick={handleAddRule} data-test="AddRule">
              {strings.group.addRule}
            </Add>
            {addGroupControl}
            {canDeleteGroup ? (
              <Remove onClick={handleDeleteGroup} data-test="Remove">
                {strings.group.delete}
              </Remove>
            ) : null}
          </>
        )
      }
    >
      {children}
    </GroupContainer>
  );
};
