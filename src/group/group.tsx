import React, { useContext } from 'react';
import { BuilderGroupValues } from '../builder';
import { BuilderContext } from '../builder-context';
import { appendToGroup } from '../utils/append-to-group.util';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createId } from '../utils/create-id.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import {
  NormalizedGroupNode,
  NormalizedNode,
  NormalizedRuleNode,
} from '../utils/query-tree';
import { removeItem } from '../utils/remove-item.util';
import { updateItem } from '../utils/update-item.util';

export interface GroupProps {
  value?: BuilderGroupValues;
  isNegated?: boolean;
  children?: React.ReactNode;
  id: string;
  isRoot: boolean;
}

export const Group: React.FC<GroupProps> = ({
  value,
  isNegated,
  children,
  id,
  isRoot,
}) => {
  const {
    components,
    data,
    setData,
    onChange,
    updateData,
    strings,
    readOnly,
  } = useContext(BuilderContext);
  const {
    Add,
    Group: GroupContainer,
    GroupHeaderOption: Option,
    Remove,
  } = components;

  const addItem = (payload: NormalizedNode) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData => appendToGroup(currentData, id, payload),
      updateData
    );
  };

  const handleAddGroup = () => {
    const emptyGroup: NormalizedGroupNode = {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      id: createId(),
      parent: id,
      children: [],
    };

    addItem(emptyGroup);
  };

  const handleAddRule = () => {
    const emptyRule: NormalizedRuleNode = {
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
      currentData =>
        updateItem(currentData, id, item => {
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
      currentData =>
        updateItem(currentData, id, item => {
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
      currentData => removeItem(currentData, id),
      updateData
    );
  };

  if (!strings.group) {
    return null;
  }

  return (
    <GroupContainer
      controlsLeft={
        <>
          <Option
            isSelected={Boolean(isNegated)}
            value={!isNegated}
            disabled={readOnly}
            onClick={handleToggleNegateGroup}
            data-test="Option[not]"
          >
            {strings.group.not}
          </Option>
          <Option
            isSelected={value === 'AND'}
            value="AND"
            disabled={readOnly}
            onClick={handleChangeGroupType}
            data-test="Option[and]"
          >
            {strings.group.and}
          </Option>
          <Option
            isSelected={value === 'OR'}
            value="OR"
            disabled={readOnly}
            onClick={handleChangeGroupType}
            data-test="Option[or]"
          >
            {strings.group.or}
          </Option>
        </>
      }
      controlsRight={
        !readOnly && (
          <>
            <Add
              onClick={handleAddRule}
              label={strings.group.addRule}
              data-test="AddRule"
            />
            <Add
              onClick={handleAddGroup}
              label={strings.group.addGroup}
              data-test="AddGroup"
            />
            {!isRoot && (
              <Remove
                onClick={handleDeleteGroup}
                label={strings.group.delete}
                data-test="Remove"
              />
            )}
          </>
        )
      }
    >
      {children}
    </GroupContainer>
  );
};
