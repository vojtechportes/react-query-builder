import React, { FC, useContext } from 'react';
import { BuilderContext } from '../../builder-context';
import { SelectMulti as DefaultSelectMulti } from '../../form/select-multi';
import { applyDataUpdate } from '../../utils/apply-data-update.util';
import { isNormalizedGroupNode } from '../../utils/is-normalized-group-node.util';
import { isStringArray } from '../../utils/is-string-array.util';
import { updateItem } from '../../utils/update-item.util';

export interface ISelectMultiProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string[];
  id: string;
}

export const SelectMulti: FC<ISelectMultiProps> = ({
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
  const SelectMultiComponent =
    components.form?.SelectMulti || DefaultSelectMulti;

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

  if (!strings.form) {
    return null;
  }

  return (
    <SelectMultiComponent
      id={`query-builder-rule-${id}-value`}
      name={`query-builder-rule-${id}-value`}
      onChange={handleChange}
      onDelete={handleDelete}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={Boolean(readOnly)}
    />
  );
};
