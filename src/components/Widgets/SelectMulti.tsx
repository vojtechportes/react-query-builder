import React, { useContext } from 'react';
import { BuilderContext } from '../Builder';
import { clone } from '../../utils/clone';

export interface SelectMultiProps {
  values: { value: string; label: string }[];
  selectedValue: string[];
  id: string;
}

export const SelectMulti: React.FC<SelectMultiProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const { data, setData, onChange, components, strings } = useContext(
    BuilderContext
  );

  const { form } = components;

  const handleChange = (value: string) => {
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

  const handleDelete = (value: string) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    clonedData[parentIndex].value = clonedData[parentIndex].value.filter(
      (item: any) => item !== value
    );

    setData(clonedData);
    onChange(clonedData);
  };

  if (form && strings.form) {
    return (
      <form.SelectMulti
        onChange={handleChange}
        onDelete={handleDelete}
        selectedValue={selectedValue}
        emptyValue={strings.form.selectYourValue}
        values={values}
      />
    );
  }

  return null;
};
