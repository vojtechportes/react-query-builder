import React, { FC, useContext } from 'react';
import { BuilderContext } from '../../builder-context';
import { SelectMulti as DefaultSelectMulti } from '../../form/select-multi';
import { createReplaceNodeAction } from '../../history/create-replace-node-action';
import { findNodeById } from '../../history/find-node-by-id';
import { isNormalizedGroupNode } from '../../utils/is-normalized-group-node.util';
import { isStringArray } from '../../utils/is-string-array.util';
import { applyDataUpdate } from '../../utils/apply-data-update.util';
import { updateItem } from '../../utils/update-item.util';

export interface ISelectMultiProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string[];
  id: string;
  disabled?: boolean;
}

export const SelectMulti: FC<ISelectMultiProps> = ({
  values,
  selectedValue,
  id,
  disabled = false,
}) => {
  const {
    data,
    setData,
    onChange,
    updateData,
    dispatchAction,
    components,
    strings,
    readOnly,
  } =
    useContext(BuilderContext);
  const SelectMultiComponent =
    components.form?.SelectMulti || DefaultSelectMulti;

  const handleChange = (value: string) => {
    const currentRule = findNodeById(data, id);

    if (
      !currentRule ||
      isNormalizedGroupNode(currentRule) ||
      !isStringArray(currentRule.value)
    ) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      applyDataUpdate(
        data,
        setData,
        onChange,
        currentData =>
          updateItem(currentData, id, item => {
            if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
              return;
            }

            item.value = item.value.filter(
              currentValue => currentValue !== value
            );
            item.value.push(value);
          }),
        updateData
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextValue = currentRule.value.filter(
      currentValue => currentValue !== value
    );
    nextValue.push(value);

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentRule,
        value: nextValue,
      })
    );
  };

  const handleDelete = (value: string) => {
    const currentRule = findNodeById(data, id);

    if (
      !currentRule ||
      isNormalizedGroupNode(currentRule) ||
      !isStringArray(currentRule.value)
    ) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      applyDataUpdate(
        data,
        setData,
        onChange,
        currentData =>
          updateItem(currentData, id, item => {
            if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
              return;
            }

            item.value = item.value.filter(
              currentValue => currentValue !== value
            );
          }),
        updateData
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentRule,
        value: currentRule.value.filter(
          currentValue => currentValue !== value
        ),
      })
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <SelectMultiComponent
      id={`query-builder-rule-${id}-value`}
      name={`query-builder-rule-${id}-value`}
      onChange={handleChange}
      onDelete={handleDelete}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={Boolean(readOnly || disabled)}
    />
  );
};
