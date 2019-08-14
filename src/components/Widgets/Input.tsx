import React, { useContext } from 'react';
import { isReactTextArray, isUndefined } from '../../utils/types';
import { BuilderContext } from '../Builder';
import { clone } from '../../utils/clone';

interface InputProps {
  type: 'date' | 'number' | 'text';
  value: React.ReactText | React.ReactText[];
  id: string;
}

export const Input: React.FC<InputProps> = ({ type, value, id }) => {
  const { data, setData, onChange, components } = useContext(BuilderContext);

  const {
    form: { Input: InputBase },
  } = components;

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

  if (isReactTextArray(value)) {
    return (
      <>
        <InputBase
          type={type}
          value={value[0]}
          onChange={(value: any) => handleChange(value, 0)}
        />
        <InputBase
          type={type}
          value={value[1]}
          onChange={(value: any) => handleChange(value, 1)}
        />
      </>
    );
  } else {
    return <InputBase type={type} value={value} onChange={handleChange} />;
  }
};
