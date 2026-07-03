import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { updateItem } from '../utils/update-item.util';

export interface ISelectProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string;
  id: string;
  disabled?: boolean;
}

export const Select: FC<ISelectProps> = ({
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
  } = useContext(BuilderContext);
  const SelectComponent = components.form?.Select || DefaultSelect;
  const isDisabled = Boolean(readOnly || disabled);

  const handleChange = (value: string) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (!currentRule || 'children' in currentRule) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextData = updateItem(data, id, item => {
        if ('children' in item) {
          return;
        }

        item.valueSource = 'value';
        delete item.valueField;
        item.value = value;
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
        value,
        {
          previousValueSource: currentRule.valueSource ?? 'value',
          previousValueField: currentRule.valueField,
          valueSource: 'value',
        }
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentRule,
        valueSource: 'value',
        value,
        valueField: undefined,
      })
    );
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if ('children' in item) {
          return;
        }

        item.valueSource = 'value';
        delete item.valueField;
        item.value = value;
      }),
      id,
      currentRule.field,
      currentRule.value,
      value,
      {
        previousValueSource: currentRule.valueSource ?? 'value',
        previousValueField: currentRule.valueField,
        valueSource: 'value',
      }
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <SelectComponent
      id={`query-builder-rule-${id}-value`}
      name={`query-builder-rule-${id}-value`}
      onChange={handleChange}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={isDisabled}
    />
  );
};
