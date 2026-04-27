import React, { useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { updateItem } from '../utils/update-item.util';

export interface SelectProps {
  values: Array<{ value: string; label: string }>;
  selectedValue: string;
  id: string;
}

export const Select: React.FC<SelectProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const { data, setData, onChange, updateData, components, strings, readOnly } =
    useContext(BuilderContext);
  const { form } = components;

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

  if (!form || !strings.form) {
    return null;
  }

  return (
    <form.Select
      onChange={handleChange}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      values={values}
      disabled={readOnly}
    />
  );
};
