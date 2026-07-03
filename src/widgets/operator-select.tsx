import React, { FC, useContext } from 'react';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleValueForFieldOperator } from '../utils/create-rule-value-for-field-operator.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { getCompatibleValueFields, supportsFieldComparisonForOperator } from '../utils/field-comparison-support';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isRangeOperator } from '../utils/is-range-operator.util';
import { operatorRequiresValue } from '../utils/operator-requires-value.util';
import { getRuleValueSource } from '../utils/rule-value-source';
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
    onFieldChange,
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

    const currentValueSource = getRuleValueSource(currentRule);
    const getNextRuleValue = () => {
      const nextRequiresValue = operatorRequiresValue(value);
      const currentRequiresValue = operatorRequiresValue(currentRule.operator);

      if (!nextRequiresValue) {
        return undefined;
      }

      if (currentValueSource === 'field') {
        return undefined;
      }

      if (
        !currentRequiresValue ||
        isRangeOperator(currentRule.operator) !== isRangeOperator(value)
      ) {
        return createRuleValueForFieldOperator(nextField, value);
      }

      return currentRule.value;
    };
    const nextRuleValue = getNextRuleValue();
    const canKeepFieldComparison =
      currentValueSource === 'field' &&
      supportsFieldComparisonForOperator(nextField, value);
    const shouldPreserveUnsupportedFieldComparison =
      currentValueSource === 'field' && operatorRequiresValue(value);
    const nextCompatibleFields = getCompatibleValueFields(fields, nextField, value);
    const hasRuleValueChanged =
      nextRuleValue !== currentRule.value ||
      currentValueSource !== 'value' ||
      typeof currentRule.valueField !== 'undefined';

    if (!dispatchAction && setData && onChange) {
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        if (typeof nextRuleValue === 'undefined') {
          if (canKeepFieldComparison && nextCompatibleFields.length > 0) {
            item.valueSource = 'field';
            item.valueField =
              currentRule.valueField &&
              nextCompatibleFields.some(fieldItem => fieldItem.field === currentRule.valueField)
                ? currentRule.valueField
                : nextCompatibleFields[0].field;
            delete item.value;
          } else if (shouldPreserveUnsupportedFieldComparison) {
            item.valueSource = 'field';
            item.valueField = currentRule.valueField;
            delete item.value;
          } else {
            item.valueSource = 'value';
            delete item.valueField;
            delete item.value;
          }
        } else {
          item.valueSource = 'value';
          delete item.valueField;
          item.value = nextRuleValue;
        }

        item.operator = value;
      });

      applyDataUpdate(
        data,
        setData,
        onChange,
        () => nextData,
        updateData
      );
      const nextRule = findNodeById(nextData, id);

      if (
        nextRule &&
        !isNormalizedGroupNode(nextRule) &&
        hasRuleValueChanged
      ) {
        emitBuilderFieldChange(
          onFieldChange,
          nextData,
          id,
          currentRule.field,
          currentRule.value,
          nextRule.value,
          {
            previousValueSource: currentRule.valueSource ?? 'value',
            previousValueField: currentRule.valueField,
            valueSource: nextRule.valueSource ?? 'value',
            valueField: nextRule.valueField,
          }
        );
      }
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextRule = { ...currentRule };
    if (typeof nextRuleValue === 'undefined') {
      if (canKeepFieldComparison && nextCompatibleFields.length > 0) {
        nextRule.valueSource = 'field';
        nextRule.valueField =
          currentRule.valueField &&
          nextCompatibleFields.some(fieldItem => fieldItem.field === currentRule.valueField)
            ? currentRule.valueField
            : nextCompatibleFields[0].field;
        delete nextRule.value;
      } else if (shouldPreserveUnsupportedFieldComparison) {
        nextRule.valueSource = 'field';
        nextRule.valueField = currentRule.valueField;
        delete nextRule.value;
      } else {
        nextRule.valueSource = 'value';
        delete nextRule.valueField;
        delete nextRule.value;
      }
    } else {
      nextRule.valueSource = 'value';
      delete nextRule.valueField;
      nextRule.value = nextRuleValue;
    }

    nextRule.operator = value;

    dispatchAction(createReplaceNodeAction(id, nextRule));
    if (hasRuleValueChanged) {
      emitBuilderFieldChange(
        onFieldChange,
        updateItem(data, id, item => {
          if (isNormalizedGroupNode(item)) {
            return;
          }

          item.operator = nextRule.operator;
          item.valueSource = nextRule.valueSource;
          if (nextRule.valueSource === 'field') {
            item.valueField = nextRule.valueField;
            delete item.value;
          } else {
            delete item.valueField;
            item.value = nextRule.value;
          }
        }),
        id,
        currentRule.field,
        currentRule.value,
        nextRule.value,
        {
          previousValueSource: currentRule.valueSource ?? 'value',
          previousValueField: currentRule.valueField,
          valueSource: nextRule.valueSource ?? 'value',
          valueField: nextRule.valueField,
        }
      );
    }
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
