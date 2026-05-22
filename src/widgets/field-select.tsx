import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleStateForField } from '../utils/create-rule-state-for-field.util';
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
  } = useContext(BuilderContext);
  const Select = components.form?.Select || DefaultSelect;

  const handleChange = (value: string) => {
    const nextField = fields.find(item => item.field === value);
    const currentRule = findNodeById(data, id);

    if (!nextField || !currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      applyDataUpdate(
        data,
        setData,
        onChange,
        currentData =>
          updateItem(currentData, id, item => {
            if (isNormalizedGroupNode(item)) {
              return;
            }

            const nextRuleState = createRuleStateForField(nextField);
            Object.keys(item).forEach(key => {
              if (!['id', 'parent', 'readOnly'].includes(key)) {
                delete ((item as unknown) as Record<string, unknown>)[key];
              }
            });
            Object.assign(item, nextRuleState);
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
        id: currentRule.id,
        parent: currentRule.parent,
        readOnly: currentRule.readOnly,
        ...createRuleStateForField(nextField),
      })
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
      disabled={readOnly || disabled}
    />
  );
};
