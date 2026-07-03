import React, { FC, useContext } from 'react';
import { IBuilderFieldProps } from '../builder';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { updateItem } from '../utils/update-item.util';

export interface IValueFieldSelectProps {
  id: string;
  selectedValue?: string;
  compatibleFields: IBuilderFieldProps[];
  disabled?: boolean;
}

export const ValueFieldSelect: FC<IValueFieldSelectProps> = ({
  id,
  selectedValue,
  compatibleFields,
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
  const Select = components.form?.Select || DefaultSelect;
  const isDisabled = Boolean(readOnly || disabled);

  const handleChange = (value: string) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (!currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        item.valueSource = 'field';
        item.valueField = value;
        delete item.value;
      });

      applyDataUpdate(data, setData, onChange, () => nextData, updateData);
      emitBuilderFieldChange(
        onFieldChange,
        nextData,
        id,
        currentRule.field,
        currentRule.value,
        undefined,
        {
          previousValueSource: currentRule.valueSource ?? 'value',
          previousValueField: currentRule.valueField,
          valueSource: 'field',
          valueField: value,
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
        valueSource: 'field',
        valueField: value,
        value: undefined,
      })
    );
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        item.valueSource = 'field';
        item.valueField = value;
        delete item.value;
      }),
      id,
      currentRule.field,
      currentRule.value,
      undefined,
      {
        previousValueSource: currentRule.valueSource ?? 'value',
        previousValueField: currentRule.valueField,
        valueSource: 'field',
        valueField: value,
      }
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <Select
      id={`query-builder-rule-${id}-value-field`}
      name={`query-builder-rule-${id}-value-field`}
      values={compatibleFields.map(field => ({
        value: field.field,
        label: field.label,
      }))}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectField || 'Select field'}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};
