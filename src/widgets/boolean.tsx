import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Switch as DefaultSwitch } from '../form/switch';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { updateItem } from '../utils/update-item.util';

export interface IBooleanProps {
  selectedValue: boolean;
  id: string;
}

export const Boolean: FC<IBooleanProps> = ({ selectedValue, id }) => {
  const { data, setData, onChange, updateData, components, readOnly } =
    useContext(BuilderContext);

  const Switch = components.form?.Switch || DefaultSwitch;

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

  return (
    <Switch
      onChange={handleChange}
      switched={selectedValue}
      disabled={readOnly}
    />
  );
};
