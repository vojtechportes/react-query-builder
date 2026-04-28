import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { updateItem } from '../utils/update-item.util';

export interface ISelectProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string;
  id: string;
}

export const Select: FC<ISelectProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const { data, setData, onChange, updateData, components, strings, readOnly } =
    useContext(BuilderContext);
  const SelectComponent = components.form?.Select || DefaultSelect;

  const handleChange = (value: string) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          item.value = value;
        }),
      updateData
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <SelectComponent
      onChange={handleChange}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={readOnly}
    />
  );
};
