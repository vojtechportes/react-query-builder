import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Input as DefaultInput } from '../form/input';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { coerceNumberInputValue } from '../utils/coerce-number-input-value.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isStringOrNumberArray } from '../utils/is-string-or-number-array.util';
import { isUndefined } from '../utils/is-undefined.util';
import { updateItem } from '../utils/update-item.util';

export interface IInputProps {
  value: string | number | Array<string | number>;
  type: 'text' | 'date' | 'number';
  id: string;
}

export const Input: FC<IInputProps> = ({ value, type, id }) => {
  const {
    data,
    setData,
    onChange,
    updateData,
    components,
    readOnly,
  } = useContext(BuilderContext);
  const InputComponent = components.form?.Input || DefaultInput;

  const handleChange = (selectedValue: string, index = 0) => {
    const nextValue =
      type === 'number' ? coerceNumberInputValue(selectedValue) : selectedValue;

    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          if (isNormalizedGroupNode(item)) {
            return;
          }

          if (isStringOrNumberArray(item.value)) {
            item.value[index] = nextValue;
            return;
          }

          item.value = nextValue;
        }),
      updateData
    );
  };

  if (isStringOrNumberArray(value)) {
    return (
      <>
        <InputComponent
          type={type}
          value={value[0]}
          onChange={(selectedValue: string) => handleChange(selectedValue, 0)}
          disabled={readOnly}
        />
        <InputComponent
          type={type}
          value={value[1]}
          onChange={(selectedValue: string) => handleChange(selectedValue, 1)}
          disabled={readOnly}
        />
      </>
    );
  }

  if (isUndefined(value)) {
    return null;
  }

  return (
    <InputComponent
      type={type}
      value={value}
      onChange={handleChange}
      disabled={readOnly}
    />
  );
};
