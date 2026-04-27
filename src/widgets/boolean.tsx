import React, { useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { updateItem } from '../utils/update-item.util';

export interface BooleanProps {
  selectedValue: boolean;
  id: string;
}

export const Boolean: React.FC<BooleanProps> = ({ selectedValue, id }) => {
  const { data, setData, onChange, updateData, components, readOnly } =
    useContext(BuilderContext);

  const { form } = components;

  const handleChange = (value: boolean) => {
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

  if (!form) {
    return null;
  }

  return (
    <form.Switch
      onChange={handleChange}
      switched={selectedValue}
      disabled={readOnly}
    />
  );
};
