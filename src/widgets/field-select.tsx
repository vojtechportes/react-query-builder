import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleStateForField } from '../utils/create-rule-state-for-field.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { updateItem } from '../utils/update-item.util';

export interface IFieldSelectProps {
  selectedValue: string;
  id: string;
}

export const FieldSelect: FC<IFieldSelectProps> = ({
  selectedValue,
  id,
}) => {
  const {
    fields,
    data,
    setData,
    onChange,
    updateData,
    components,
    strings,
    readOnly,
  } = useContext(BuilderContext);
  const Select = components.form?.Select || DefaultSelect;

  const handleChange = (value: string) => {
    const nextField = fields.find(item => item.field === value);

    if (!nextField) {
      return;
    }

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

          delete item.value;
          delete item.operators;
          delete item.operator;
          Object.assign(item, nextRuleState);
        }),
      updateData
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
      values={fieldNames}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      onChange={handleChange}
      disabled={readOnly}
    />
  );
};
