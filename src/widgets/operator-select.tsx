import React, { FC, useContext } from 'react';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Select as DefaultSelect } from '../form/select';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { isStringArray } from '../utils/is-string-array.util';
import { updateItem } from '../utils/update-item.util';

export interface IOperatorSelectValuesProps {
  value: BuilderFieldOperator;
  label: string;
}

export interface IOperatorSelectProps {
  values: IOperatorSelectValuesProps[];
  selectedValue?: BuilderFieldOperator;
  id: string;
}

export const OperatorSelect: FC<IOperatorSelectProps> = ({
  values,
  selectedValue,
  id,
}) => {
  const {
    fields,
    data,
    setData,
    onChange,
    updateData,
    components,
    strings,
    readOnly,
  } = useContext(BuilderContext);
  const Select = components.form?.Select || DefaultSelect;

  const handleChange = (value: BuilderFieldOperator) => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData =>
        updateItem(currentData, id, item => {
          if (isNormalizedGroupNode(item)) {
            return;
          }

          const fieldIndex = fields.findIndex(
            fieldItem => item.field === fieldItem.field
          );

          if (['DATE', 'TEXT', 'NUMBER'].includes(fields[fieldIndex].type)) {
            if (
              !['BETWEEN', 'NOT_BETWEEN'].includes(value) &&
              isStringArray(item.value)
            ) {
              item.value = fields[fieldIndex].type === 'NUMBER' ? '0' : '';
            } else if (
              ['BETWEEN', 'NOT_BETWEEN'].includes(value) &&
              !isStringArray(item.value)
            ) {
              item.value =
                fields[fieldIndex].type === 'NUMBER' ? ['0', '0'] : ['', ''];
            }
          }

          item.operator = value;
        }),
      updateData
    );
  };

  if (!strings.form) {
    return null;
  }

  return (
    <Select
      values={values}
      selectedValue={selectedValue}
      emptyValue={strings.form.selectYourValue}
      onChange={handleChange}
      disabled={readOnly}
    />
  );
};
