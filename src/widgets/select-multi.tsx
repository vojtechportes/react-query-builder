import React, { useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isStringArray } from '../utils/is-string-array.util';
import { updateItem } from '../utils/update-item.util';

export interface SelectMultiProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string[];
  id: string;
}

export const SelectMulti: React.FC<SelectMultiProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const {
    data,
    setData,
    onChange,
    updateData,
    components,
    strings,
    readOnly,
  } = useContext(BuilderContext);
  const { form } = components;

  const handleChange = (value: string) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
            return;
          }

          item.value = item.value.filter(currentValue => currentValue !== value);
          item.value.push(value);
        }),
      updateData
    );
  };

  const handleDelete = (value: string) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          if (isNormalizedGroupNode(item) || !isStringArray(item.value)) {
            return;
          }

          item.value = item.value.filter(currentValue => currentValue !== value);
        }),
      updateData
    );
  };

  if (!form || !strings.form) {
    return null;
  }

  return (
    <form.SelectMulti
      onChange={handleChange}
      onDelete={handleDelete}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={Boolean(readOnly)}
    />
  );
};
