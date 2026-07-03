import React, { FC, useContext } from 'react';
import { IBuilderFieldProps } from '../builder';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleValueForFieldOperator } from '../utils/create-rule-value-for-field-operator.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { QueryRuleValueSource } from '../utils/query-tree';
import { updateItem } from '../utils/update-item.util';

export interface IValueSourceSelectProps {
  id: string;
  field: IBuilderFieldProps;
  selectedValueSource: QueryRuleValueSource;
  compatibleFields: IBuilderFieldProps[];
  fieldComparisonEnabled?: boolean;
  disabled?: boolean;
}

export const ValueSourceSelect: FC<IValueSourceSelectProps> = ({
  id,
  field,
  selectedValueSource,
  compatibleFields,
  fieldComparisonEnabled = true,
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

  const handleChange = (nextValueSource: QueryRuleValueSource) => {
    if (isDisabled) {
      return;
    }

    const currentRule = findNodeById(data, id);

    if (!currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    if (nextValueSource === 'field' && !fieldComparisonEnabled) {
      return;
    }

    const nextRule =
      nextValueSource === 'field'
        ? compatibleFields[0]
          ? {
              ...currentRule,
              valueSource: 'field' as const,
              valueField: compatibleFields[0].field,
              value: undefined,
            }
          : null
        : {
            ...currentRule,
            valueSource: 'value' as const,
            valueField: undefined,
            value: createRuleValueForFieldOperator(field, currentRule.operator),
          };

    if (!nextRule) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        item.valueSource = nextRule.valueSource;
        if (nextRule.valueSource === 'field') {
          item.valueField = nextRule.valueField;
          delete item.value;
        } else {
          delete item.valueField;
          item.value = nextRule.value;
        }
      });

      applyDataUpdate(data, setData, onChange, () => nextData, updateData);
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
          valueSource: nextRule.valueSource,
          valueField: nextRule.valueField,
        }
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    dispatchAction(createReplaceNodeAction(id, nextRule));
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

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
        valueSource: nextRule.valueSource,
        valueField: nextRule.valueField,
      }
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <Select
      id={`query-builder-rule-${id}-value-source`}
      name={`query-builder-rule-${id}-value-source`}
      values={[
        {
          value: 'value',
          label: strings.form.compareToValue || 'Value',
        },
        {
          value: 'field',
          label: strings.form.compareToField || 'Field',
          disabled: !fieldComparisonEnabled || compatibleFields.length === 0,
        },
      ]}
      selectedValue={selectedValueSource}
      emptyValue={strings.form.compareToValue}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};
