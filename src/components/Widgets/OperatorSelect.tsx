import React, { useContext } from 'react';
import { clone } from '../../utils/clone';
import { isStringArray } from '../../utils/types';
import { BuilderFieldOperator } from '../Builder';
import { BuilderContext } from '../Context';

export interface OperatorSelectValuesProps {
  value: BuilderFieldOperator;
  label?: string;
}

export interface OperatorSelectProps {
  values: OperatorSelectValuesProps[];
  selectedValue?: BuilderFieldOperator;
  id: string;
}

export const OperatorSelect: React.FC<OperatorSelectProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const {
    fields,
    data,
    setData,
    onChange,
    components,
    strings,
    readOnly,
  } = useContext(BuilderContext);

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
        isStringArray(clonedData[parentIndex].value)
      ) {
        clonedData[parentIndex].value =
          fields[fieldIndex].type === 'NUMBER' ? '0' : '';
      } else if (
        ['BETWEEN', 'NOT_BETWEEN'].includes(value) &&
        !isStringArray(clonedData[parentIndex].value)
      ) {
        clonedData[parentIndex].value =
          fields[fieldIndex].type === 'NUMBER' ? ['0', '0'] : ['', ''];
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
        disabled={readOnly}
      />
    );
  }

  return null;
};
