import React, { useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isStringArray } from '../utils/is-string-array.util';
import { isUndefined } from '../utils/is-undefined.util';
import { updateItem } from '../utils/update-item.util';

export interface InputProps {
  value: string | string[];
  type: 'text' | 'date' | 'number';
  id: string;
}

export const Input: React.FC<InputProps> = ({ value, type, id }) => {
  const {
    data,
    setData,
    onChange,
    updateData,
    components,
    readOnly,
  } = useContext(BuilderContext);
  const { form } = components;

  const handleChange = (selectedValue: string, index = 0) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          if (isNormalizedGroupNode(item)) {
            return;
          }

          if (isStringArray(item.value)) {
            item.value[index] = selectedValue;
            return;
          }

          item.value = selectedValue;
        }),
      updateData
    );
  };

  if (!form) {
    return null;
  }

  if (isStringArray(value)) {
    return (
      <>
        <form.Input
          type={type}
          value={value[0]}
          onChange={(selectedValue: string) => handleChange(selectedValue, 0)}
          disabled={readOnly}
        />
        <form.Input
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
    <form.Input
      type={type}
      value={value}
      onChange={handleChange}
      disabled={readOnly}
    />
  );
};
