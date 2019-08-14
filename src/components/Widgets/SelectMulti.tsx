import React, { useContext } from 'react';
import { BuilderContext } from '../Builder';
import { clone } from '../../utils/clone';

export interface SelectMultiProps {
  values: { value: React.ReactText; label: string }[];
  selectedValue: React.ReactText[];
  id: string;
}

export const SelectMulti: React.FC<SelectMultiProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const { data, setData, onChange, components } = useContext(BuilderContext);

  const {
    form: { SelectMulti: SelectMultiBase },
  } = components;

  const handleChange = (value: React.ReactText) => {
    if (setData && onChange) {
      const clonedData = clone(data);
      const parentIndex = clonedData.findIndex((item: any) => item.id === id);

      clonedData[parentIndex].value = clonedData[parentIndex].value.filter(
        (item: any) => item !== value
      );
      clonedData[parentIndex].value.push(value);

      setData(clonedData);
      onChange(clonedData);
    }
  };

  const handleDelete = (value: React.ReactText) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    clonedData[parentIndex].value = clonedData[parentIndex].value.filter(
      (item: any) => item !== value
    );

    setData(clonedData);
    onChange(clonedData);
  };

  return (
    <SelectMultiBase
      onChange={handleChange}
      onDelete={handleDelete}
      selectedValue={selectedValue}
      values={values}
    />
  );
};
