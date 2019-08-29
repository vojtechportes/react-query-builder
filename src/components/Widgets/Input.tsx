import React, { useContext } from 'react';
import { isStringArray, isUndefined } from '../../utils/types';
import { BuilderContext } from '../Context'
import { clone } from '../../utils/clone';

interface InputProps {
  type: 'date' | 'number' | 'text';
  value: string | string[];
  id: string;
}

export const Input: React.FC<InputProps> = ({ type, value, id }) => {
  const { data, setData, onChange, components } = useContext(BuilderContext);

  const { form } = components;

  const handleChange = (value: any, index?: number) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    if (!isUndefined(index)) {
      clonedData[parentIndex].value[index] = value;
    } else {
      clonedData[parentIndex].value = value;
    }

    setData(clonedData);
    onChange(clonedData);
  };

  if (form) {
    if (isStringArray(value)) {
      return (
        <>
          <form.Input
            type={type}
            value={value[0]}
            onChange={(value: any) => handleChange(value, 0)}
          />
          <form.Input
            type={type}
            value={value[1]}
            onChange={(value: any) => handleChange(value, 1)}
          />
        </>
      );
    } else {
      return <form.Input type={type} value={value} onChange={handleChange} />;
    }
  }

  return null;
};
