import React, { useContext } from 'react';
import { BuilderContext, BuilderFieldOperator } from '../Builder';
import { clone } from '../../utils/clone';
import { isReactTextArray } from '../../utils/types';

interface OperatorSelectProps {
  values: { value: BuilderFieldOperator; label?: string }[];
  selectedValue?: BuilderFieldOperator;
  id: string;
}

export const OperatorSelect: React.FC<OperatorSelectProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const { fields, data, setData, onChange, components, strings } = useContext(
    BuilderContext
  );

  const { form } = components;

  const handleChange = (value: BuilderFieldOperator) => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);
    const fieldIndex = fields.findIndex(
      (item: any) => clonedData[parentIndex].field === item.field
    );

    if (['DATE', 'TEXT', 'NUMBER'].includes(fields[fieldIndex].type)) {
      if (
        !['BETWEEN', 'NOT_BETWEEN'].includes(value) &&
        isReactTextArray(clonedData[parentIndex].value)
      ) {
        clonedData[parentIndex].value = '';
      } else if (
        ['BETWEEN', 'NOT_BETWEEN'].includes(value) &&
        !isReactTextArray(clonedData[parentIndex].value)
      ) {
        clonedData[parentIndex].value = ['', ''];
      }
    }

    clonedData[parentIndex].operator = value;

    setData(clonedData);
    onChange(clonedData);
  };

  if (form && strings.form) {
    return (
      <form.Select
        values={values}
        selectedValue={selectedValue}
        emptyValue={strings.form.selectYourValue}
        onChange={handleChange}
      />
    );
  }

  return null;
};
