import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleStateForField } from '../utils/create-rule-state-for-field.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { updateItem } from '../utils/update-item.util';

export interface IFieldSelectProps {
  selectedValue: string;
  id: string;
  disabled?: boolean;
}

export const FieldSelect: FC<IFieldSelectProps> = ({
  selectedValue,
  id,
  disabled = false,
}) => {
  const {
    fields,
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

    const nextField = fields.find(item => item.field === value);
    const currentRule = findNodeById(data, id);

    if (!nextField || !currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextRuleState = createRuleStateForField(nextField);
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        Object.keys(item).forEach(key => {
          if (!['id', 'parent', 'readOnly'].includes(key)) {
            delete ((item as unknown) as Record<string, unknown>)[key];
          }
        });
        Object.assign(item, nextRuleState);
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
        nextField.field,
        currentRule.value,
        nextRuleState.value
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextRuleState = createRuleStateForField(nextField);

    dispatchAction(
      createReplaceNodeAction(id, {
        id: currentRule.id,
        parent: currentRule.parent,
        readOnly: currentRule.readOnly,
        ...nextRuleState,
      })
    );
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        Object.keys(item).forEach(key => {
          if (!['id', 'parent', 'readOnly'].includes(key)) {
            delete ((item as unknown) as Record<string, unknown>)[key];
          }
        });
        Object.assign(item, nextRuleState);
      }),
      id,
      nextField.field,
      currentRule.value,
      nextRuleState.value
    );
  };

  const fieldNames = fields.map(field => ({
    value: field.field,
    label: field.label,
  }));

  if (!strings.form) {
    return null;
  }

  return (
    <Select
      id={`query-builder-rule-${id}-field`}
      name={`query-builder-rule-${id}-field`}
      values={fieldNames}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};
