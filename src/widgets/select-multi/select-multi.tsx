import React, { FC, useContext } from 'react';
import { BuilderContext } from '../../builder-context';
import { SelectMulti as DefaultSelectMulti } from '../../form/select-multi';
import { createReplaceNodeAction } from '../../history/create-replace-node-action';
import { findNodeById } from '../../history/find-node-by-id';
import { isNormalizedGroupNode } from '../../utils/is-normalized-group-node.util';
import { isStringArray } from '../../utils/is-string-array.util';
import { applyDataUpdate } from '../../utils/apply-data-update.util';
import { emitBuilderFieldChange } from '../../utils/emit-builder-field-change.util';
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
    onFieldChange,
  } =
    useContext(BuilderContext);
  const SelectMultiComponent =
    components.form?.SelectMulti || DefaultSelectMulti;
  const isDisabled = Boolean(readOnly || disabled);

  const handleChange = (value: string) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (
      !currentRule ||
      isNormalizedGroupNode(currentRule) ||
      !isStringArray(currentRule.value)
    ) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextValue = currentRule.value.filter(
        currentValue => currentValue !== value
      );
      nextValue.push(value);
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
          return;
        }

        item.value = nextValue;
      });

      applyDataUpdate(
        data,
        setData,
        onChange,
        () => nextData,
        updateData
      );
      emitBuilderFieldChange(
        onFieldChange,
        nextData,
        id,
        currentRule.field,
        currentRule.value,
        nextValue
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
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
          return;
        }

        item.value = nextValue;
      }),
      id,
      currentRule.field,
      currentRule.value,
      nextValue
    );
  };

  const handleDelete = (value: string) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (
      !currentRule ||
      isNormalizedGroupNode(currentRule) ||
      !isStringArray(currentRule.value)
    ) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextValue = currentRule.value.filter(
        currentValue => currentValue !== value
      );
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
          return;
        }

        item.value = nextValue;
      });

      applyDataUpdate(
        data,
        setData,
        onChange,
        () => nextData,
        updateData
      );
      emitBuilderFieldChange(
        onFieldChange,
        nextData,
        id,
        currentRule.field,
        currentRule.value,
        nextValue
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextValue = currentRule.value.filter(
      currentValue => currentValue !== value
    );

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentRule,
        value: nextValue,
      })
    );
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
          return;
        }

        item.value = nextValue;
      }),
      id,
      currentRule.field,
      currentRule.value,
      nextValue
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
      disabled={isDisabled}
    />
  );
};
