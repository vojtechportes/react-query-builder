import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Rule as DefaultRuleContainer } from './rule-container';
import { SecondaryButton } from '../secondary-button';
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

export interface IRuleProps {
  field: string;
  value?: QueryRuleValue;
  operator?: BuilderFieldOperator;
  id: string;
  dragHandle?: React.ReactNode;
  'data-test'?: string;
}

export const Rule: FC<IRuleProps> = ({
  field: fieldRef,
  value: selectedValue,
  operator,
  id,
  dragHandle,
  'data-test': dataTest,
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
  const RuleContainer = components.Rule || DefaultRuleContainer;
  const Remove = components.Remove || SecondaryButton;

  const handleDelete = useCallback(() => {
    applyDataUpdate(
      data,
      setData,
      onChange,
      currentData => removeItem(currentData, id),
      updateData
    );
  }, [data, id, onChange, setData, updateData]);

  if (!fields || !strings.rule) {
    return null;
  }

  if (fieldRef === '') {
    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={
          !readOnly && <Remove onClick={handleDelete}>{strings.rule.delete}</Remove>
        }
        data-test={dataTest}
      >
        <FieldSelect selectedValue="" id={id} />
      </RuleContainer>
    );
  }

  try {
    const fieldIndex = fields.findIndex(item => item.field === fieldRef);
    const { field, operators, type, value: fieldValue } = fields[fieldIndex];
    const operatorsOptionList =
      operators &&
      operators.map(item => ({
        value: item,
        label: (strings.operators && strings.operators[item]) || item,
      }));

    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={
          !readOnly && <Remove onClick={handleDelete}>{strings.rule.delete}</Remove>
        }
        data-test={dataTest}
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
      </RuleContainer>
    );
  } catch (error) {
    console.error(`Field "${fieldRef}" not found in fields definition.`);
  }

  return null;
};
