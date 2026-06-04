import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { BuilderContext } from '../builder-context';
import { Input as DefaultInput } from '../form/input';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { compactBuilderMedia } from '../styles/responsive.styles';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { coerceNumberInputValue } from '../utils/coerce-number-input-value.util';
import { emitBuilderFieldChange } from '../utils/emit-builder-field-change.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isStringOrNumberArray } from '../utils/is-string-or-number-array.util';
import { isUndefined } from '../utils/is-undefined.util';
import { updateItem } from '../utils/update-item.util';

const RangeInputs = styled.div`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 0.5rem;
  width: 100%;

  ${compactBuilderMedia`
    grid-auto-flow: row;
  `}
`;

export interface IInputProps {
  value: string | number | Array<string | number>;
  type: 'text' | 'date' | 'number';
  id: string;
  disabled?: boolean;
}

export const Input: FC<IInputProps> = ({
  value,
  type,
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
  const InputComponent = components.form?.Input || DefaultInput;
  const isDisabled = Boolean(readOnly || disabled);

  const handleChange = (selectedValue: string, index = 0) => {
    if (isDisabled) {
      return;
    }

    const nextValue =
      type === 'number' ? coerceNumberInputValue(selectedValue) : selectedValue;
    const currentRule = findNodeById(data, id);

    if (!currentRule || isNormalizedGroupNode(currentRule)) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      const nextData = updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        if (isStringOrNumberArray(item.value)) {
          const nextRangeValue = item.value.slice() as typeof item.value;
          nextRangeValue[index] = nextValue;
          item.value = nextRangeValue;
          return;
        }

        item.value = nextValue;
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
        isStringOrNumberArray(currentRule.value)
          ? (() => {
              const nextRangeValue =
                currentRule.value.slice() as typeof currentRule.value;
              nextRangeValue[index] = nextValue;
              return nextRangeValue;
            })()
          : nextValue
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    const nextRule = { ...currentRule };

    if (isStringOrNumberArray(currentRule.value)) {
      const nextRangeValue =
        currentRule.value.slice() as typeof currentRule.value;
      nextRangeValue[index] = nextValue;
      nextRule.value = nextRangeValue;
    } else {
      nextRule.value = nextValue;
    }

    dispatchAction(createReplaceNodeAction(id, nextRule));
    emitBuilderFieldChange(
      onFieldChange,
      updateItem(data, id, item => {
        if (isNormalizedGroupNode(item)) {
          return;
        }

        item.value = nextRule.value;
      }),
      id,
      currentRule.field,
      currentRule.value,
      nextRule.value
    );
  };

  if (isStringOrNumberArray(value)) {
    return (
      <RangeInputs>
        <InputComponent
          id={`query-builder-rule-${id}-value-start`}
          name={`query-builder-rule-${id}-value-start`}
          type={type}
          value={value[0]}
          onChange={(selectedValue: string) => handleChange(selectedValue, 0)}
          disabled={isDisabled}
        />
        <InputComponent
          id={`query-builder-rule-${id}-value-end`}
          name={`query-builder-rule-${id}-value-end`}
          type={type}
          value={value[1]}
          onChange={(selectedValue: string) => handleChange(selectedValue, 1)}
          disabled={isDisabled}
        />
      </RangeInputs>
    );
  }

  if (isUndefined(value)) {
    return null;
  }

  return (
    <InputComponent
      id={`query-builder-rule-${id}-value`}
      name={`query-builder-rule-${id}-value`}
      type={type}
      value={value}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};
