import React, { useContext } from 'react';
import { clone } from '../../utils/clone';
import { BuilderContext } from '../Context';

export interface BooleanProps {
  selectedValue: boolean;
  id: string;
}

// tslint:disable-next-line: variable-name
export const Boolean: React.FC<BooleanProps> = ({ selectedValue, id }) => {
  const { data, setData, onChange, components, readOnly } = useContext(
    BuilderContext
  );

  const { form } = components;

  const handleChange = (value: boolean) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    clonedData[parentIndex].value = value;

    setData(clonedData);
    onChange(clonedData);
  };

  if (form) {
    return (
      <form.Switch
        onChange={handleChange}
        switched={selectedValue}
        disabled={readOnly}
      />
    );
  }

  return null;
};
