import React, { useContext } from 'react';
import { BuilderGroupValues, BuilderContext } from '../Builder';
import uniqid from 'uniqid';
import { clone } from '../../utils/clone';

export interface GroupProps {
  value?: BuilderGroupValues;
  isNegated?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  id: string;
}

export const Group: React.FC<GroupProps> = ({
  value,
  isNegated,
  children,
  id,
}) => {
  const { components, data, setData, onChange } = useContext(BuilderContext);

  const { Add, Group: GroupContainer, GroupHeaderOption: Option } = components;

  const findIndex = () => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);
    let insertAfter = parentIndex;

    if (data[parentIndex].children) {
      const lastChildren = clonedData[parentIndex].children.slice(-1)[0];
      insertAfter = clonedData.findIndex(
        (item: any) => item.id === lastChildren
      );
    }

    return { insertAfter, parentIndex, clonedData };
  };

  const addItem = (payload: any) => {
    const { insertAfter, parentIndex, clonedData } = findIndex();

    if (!clonedData[parentIndex].children) {
      clonedData[insertAfter].children = [];
    }

    clonedData[parentIndex].children.push(payload.id);
    clonedData.splice(insertAfter, 0, payload);

    setData(clonedData);
    onChange(clonedData);
  };

  const handleAddGroup = () => {
    const EmptyGroup: any = {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      id: uniqid(),
      parent: id,
      children: [],
    };

    addItem(EmptyGroup);
  };

  const handleAddRule = () => {
    const EmptyRule: any = {
      field: '',
      id: uniqid(),
      parent: id,
    };

    addItem(EmptyRule);
  };

  const handleChangeGroupType = (nextValue: BuilderGroupValues) => {
    const { clonedData, parentIndex } = findIndex();
    clonedData[parentIndex].value = nextValue;

    setData(clonedData);
    onChange(clonedData);
  };

  const handleToggleNegateGroup = (nextValue: boolean) => {
    const { clonedData, parentIndex } = findIndex();
    clonedData[parentIndex].isNegated = nextValue;

    setData(clonedData);
    onChange(clonedData);
  };

  return (
    <GroupContainer
      controlsLeft={
        <>
          <Option
            isSelected={!!isNegated}
            value={!isNegated}
            onClick={handleToggleNegateGroup}
          >
            NOT
          </Option>
          <Option
            isSelected={value === 'AND'}
            value="AND"
            onClick={handleChangeGroupType}
          >
            AND
          </Option>
          <Option
            isSelected={value === 'OR'}
            value="OR"
            onClick={handleChangeGroupType}
          >
            OR
          </Option>
        </>
      }
      controlsRight={
        <>
          <Add onClick={handleAddRule} label="Add Rule" />
          <Add onClick={handleAddGroup} label="Add Group" />
        </>
      }
    >
      {children}
    </GroupContainer>
  );
};
