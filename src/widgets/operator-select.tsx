import React, { FC, useContext } from 'react';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleValueForFieldOperator } from '../utils/create-rule-value-for-field-operator.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isRangeOperator } from '../utils/is-range-operator.util';
import { operatorRequiresValue } from '../utils/operator-requires-value.util';
import { updateItem } from '../utils/update-item.util';

export interface IOperatorSelectValuesProps {
  value: BuilderFieldOperator;
  label: string;
}

export interface IOperatorSelectProps {
  values: IOperatorSelectValuesProps[];
  selectedValue?: BuilderFieldOperator;
  id: string;
  disabled?: boolean;
}

export const OperatorSelect: FC<IOperatorSelectProps> = ({
  values,
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
  } =
    useContext(BuilderContext);
  const Select = components.form?.Select || DefaultSelect;
  const isDisabled = Boolean(readOnly || disabled);

  const handleChange = (value: BuilderFieldOperator) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (!currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    const nextField = fields.find(
      fieldItem => currentRule.field === fieldItem.field
    );

    if (!nextField) {
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

            const nextRequiresValue = operatorRequiresValue(value);
            const currentRequiresValue = operatorRequiresValue(item.operator);

            if (!nextRequiresValue) {
              delete item.value;
            } else if (
              !currentRequiresValue ||
              isRangeOperator(item.operator) !== isRangeOperator(value)
            ) {
              item.value = createRuleValueForFieldOperator(nextField, value);
            }

            item.operator = value;
          }),
        updateData
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextRule = { ...currentRule };
    const nextRequiresValue = operatorRequiresValue(value);
    const currentRequiresValue = operatorRequiresValue(currentRule.operator);

    if (!nextRequiresValue) {
      delete nextRule.value;
    } else if (
      !currentRequiresValue ||
      isRangeOperator(currentRule.operator) !== isRangeOperator(value)
    ) {
      nextRule.value = createRuleValueForFieldOperator(nextField, value);
    }

    nextRule.operator = value;

    dispatchAction(createReplaceNodeAction(id, nextRule));
  };

  if (!strings.form) {
    return null;
  }

  return (
    <Select
      id={`query-builder-rule-${id}-operator`}
      name={`query-builder-rule-${id}-operator`}
      values={values}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};
