import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { isBuilderFieldUsageExhausted } from '../builder/utils/resolve-builder-field-usage.util';
import { Select as DefaultSelect } from '../form/select';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { createRuleStateForField } from '../utils/create-rule-state-for-field.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { getCompatibleValueFields } from '../utils/field-comparison-support';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { QueryRuleValue, QueryRuleValueSource } from '../utils/query-tree';
import { getRuleValueSource } from '../utils/rule-value-source';
import { updateItem } from '../utils/update-item.util';

export interface IFieldSelectProps {
  selectedValue: string;
  id: string;
  disabled?: boolean;
}

type NextRuleState = {
  field: string;
  operator?: any;
  operators?: any;
  valueSource: QueryRuleValueSource;
  value?: QueryRuleValue;
  valueField?: string;
};

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
    allowFieldComparisons = false,
    onFieldChange,
  } = useContext(BuilderContext);
  const Select = components.form?.Select || DefaultSelect;
  const isDisabled = Boolean(readOnly || disabled);
  const currentRule = findNodeById(data, id);
  const parentId =
    currentRule && !isNormalizedGroupNode(currentRule) ? currentRule.parent : undefined;

  const createNextRuleState = (value: string) => {
    const nextField = fields.find(item => item.field === value);
    const currentRuleNode = findNodeById(data, id);

    if (!nextField || !currentRuleNode || isNormalizedGroupNode(currentRuleNode)) {
      return null;
    }

    const nextRuleState: NextRuleState = {
      ...createRuleStateForField(nextField),
    };
    const currentValueSource = getRuleValueSource(currentRuleNode);
    const nextCompatibleFields =
      allowFieldComparisons && nextRuleState.operator
        ? getCompatibleValueFields(fields, nextField, nextRuleState.operator as any)
        : [];

    if (currentValueSource === 'field' && nextCompatibleFields.length > 0) {
      nextRuleState.valueSource = 'field';
      nextRuleState.valueField =
        currentRuleNode.valueField &&
        nextCompatibleFields.some(fieldItem => fieldItem.field === currentRuleNode.valueField)
          ? currentRuleNode.valueField
          : nextCompatibleFields[0].field;
      delete nextRuleState.value;
    }

    return {
      currentRule: currentRuleNode,
      nextField,
      nextRuleState,
    };
  };

  const handleChange = (value: string) => {
    if (isDisabled) {
      return;
    }

    const nextState = createNextRuleState(value);

    if (!nextState) {
      return;
    }

    const { currentRule, nextField, nextRuleState } = nextState;

    if (!dispatchAction && setData && onChange) {
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
        nextRuleState.value,
        {
          previousValueSource: currentRule.valueSource ?? 'value',
          previousValueField: currentRule.valueField,
          valueSource: nextRuleState.valueSource ?? 'value',
          valueField: nextRuleState.valueField,
        }
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(
        id,
        {
          id: currentRule.id,
          parent: currentRule.parent,
          readOnly: currentRule.readOnly,
          ...nextRuleState,
        } as any
      )
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
      nextRuleState.value,
      {
        previousValueSource: currentRule.valueSource ?? 'value',
        previousValueField: currentRule.valueField,
        valueSource: nextRuleState.valueSource ?? 'value',
        valueField: nextRuleState.valueField,
      }
    );
  };

  const fieldNames = fields.map(field => ({
    value: field.field,
    label: field.label,
    disabled:
      field.field !== selectedValue &&
      isBuilderFieldUsageExhausted({
        data,
        fields,
        field,
        parentId,
        excludeRuleId: id,
      }),
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
