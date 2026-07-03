import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Switch as DefaultSwitch } from '../form/switch';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { updateItem } from '../utils/update-item.util';

export interface IBooleanProps {
  selectedValue: boolean;
  id: string;
  disabled?: boolean;
}

export const Boolean: FC<IBooleanProps> = ({
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
    readOnly,
    onFieldChange,
  } = useContext(BuilderContext);
  const isDisabled = !!(readOnly || disabled);

  const Switch = components.form?.Switch || DefaultSwitch;

  const handleChange = (value: boolean) => {
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

  return (
    <Switch
      onChange={handleChange}
      switched={selectedValue}
      disabled={isDisabled}
    />
  );
};
