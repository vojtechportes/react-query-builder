import React, { useContext } from 'react';
import { BuilderContext } from '../Context'
import { clone } from '../../utils/clone';

export interface SelectProps {
  selectedValue: string;
  values: { value: string; label: string }[];
  id: string;
}

export const Select: React.FC<SelectProps> = ({
  selectedValue,
  values,
  id,
}) => {
  const { data, setData, onChange, components, strings } = useContext(
    BuilderContext
  );

  const { form } = components;

  const handleChange = (value: string) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    clonedData[parentIndex].value = value;

    setData(clonedData);
    onChange(clonedData);
  };

  if (form && strings.form) {
    return (
      <form.Select
        onChange={handleChange}
        selectedValue={selectedValue}
        emptyValue={strings.form.selectYourValue}
        values={values}
      />
    );
  }

  return null
};
