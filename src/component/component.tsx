import React, { useContext } from 'react';
import styled from 'styled-components';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Boolean } from '../widgets/boolean';
import { FieldSelect } from '../widgets/field-select';
import { Input } from '../widgets/input';
import { OperatorSelect } from '../widgets/operator-select';
import { Select } from '../widgets/select';
import { SelectMulti } from '../widgets/select-multi';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { isBoolean } from '../utils/is-boolean.util';
import { isOptionList } from '../utils/is-option-list.util';
import { isString } from '../utils/is-string.util';
import { isStringArray } from '../utils/is-string-array.util';
import { isUndefined } from '../utils/is-undefined.util';
import { QueryRuleValue } from '../utils/query-tree';
import { removeItem } from '../utils/remove-item.util';

const BooleanContainer = styled.div`
  align-self: center;
`;

export interface ComponentProps {
  field: string;
  value?: QueryRuleValue;
  operator?: BuilderFieldOperator;
  id: string;
}

export const Component: React.FC<ComponentProps> = ({
  field: fieldRef,
  value: selectedValue,
  operator,
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
  const { Component: ComponentContainer, Remove } = components;

  const handleDelete = () => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData => removeItem(currentData, id),
      updateData
    );
  };

  if (!fields || !strings.component) {
    return null;
  }

  if (fieldRef === '') {
    return (
      <ComponentContainer
        controls={
          !readOnly && (
            <Remove label={strings.component.delete} onClick={handleDelete} />
          )
        }
      >
        <FieldSelect selectedValue="" id={id} />
      </ComponentContainer>
    );
  }

  try {
    const fieldIndex = fields.findIndex(item => item.field === fieldRef);
    const { field, operators, type, value: fieldValue } = fields[fieldIndex];
    const operatorsOptionList =
      operators &&
      operators.map(item => ({
        value: item,
        label: strings.operators && strings.operators[item],
      }));

    return (
      <ComponentContainer
        controls={
          !readOnly && (
            <Remove label={strings.component.delete} onClick={handleDelete} />
          )
        }
      >
        <FieldSelect selectedValue={field} id={id} />

        {type === 'BOOLEAN' && isBoolean(selectedValue) && (
          <BooleanContainer>
            <Boolean id={id} selectedValue={selectedValue} />
          </BooleanContainer>
        )}

        {type === 'LIST' &&
          isString(selectedValue) &&
          isOptionList(fieldValue) &&
          isOptionList(operatorsOptionList) && (
            <>
              <OperatorSelect
                id={id}
                values={operatorsOptionList}
                selectedValue={operator}
              />
              {operator && (
                <Select
                  id={id}
                  selectedValue={selectedValue}
                  values={fieldValue}
                />
              )}
            </>
          )}

        {type === 'MULTI_LIST' &&
          isOptionList(fieldValue) &&
          isOptionList(operatorsOptionList) &&
          isStringArray(selectedValue) && (
            <>
              <OperatorSelect
                id={id}
                values={operatorsOptionList}
                selectedValue={operator}
              />
              {operator && (
                <SelectMulti
                  id={id}
                  values={fieldValue}
                  selectedValue={selectedValue}
                />
              )}
            </>
          )}

        {type === 'TEXT' &&
          isOptionList(operatorsOptionList) &&
          (isString(selectedValue) || isStringArray(selectedValue)) && (
            <>
              <OperatorSelect
                id={id}
                values={operatorsOptionList}
                selectedValue={operator}
              />
              {operator && <Input type="text" value={selectedValue} id={id} />}
            </>
          )}

        {type === 'NUMBER' &&
          isOptionList(operatorsOptionList) &&
          (isString(selectedValue) || isStringArray(selectedValue)) && (
            <>
              <OperatorSelect
                id={id}
                values={operatorsOptionList}
                selectedValue={operator}
              />
              {operator && (
                <Input type="number" value={selectedValue} id={id} />
              )}
            </>
          )}

        {type === 'DATE' &&
          isOptionList(operatorsOptionList) &&
          (isString(selectedValue) || isStringArray(selectedValue)) && (
            <>
              <OperatorSelect
                id={id}
                values={operatorsOptionList}
                selectedValue={operator}
              />
              {!isUndefined(operator) && (
                <Input type="date" value={selectedValue} id={id} />
              )}
            </>
          )}
      </ComponentContainer>
    );
  } catch (error) {
    console.error(`Field "${fieldRef}" not found in fields definition.`);
  }

  return null;
};
