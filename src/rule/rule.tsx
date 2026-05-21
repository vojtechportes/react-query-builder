import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { BuilderFieldOperator } from '../builder';
import { BuilderContext } from '../builder-context';
import { Rule as DefaultRuleContainer } from './rule-container';
import { SecondaryButton } from '../secondary-button';
import { compactBuilderMedia } from '../styles/responsive.styles';
import { Boolean } from '../widgets/boolean';
import { FieldSelect } from '../widgets/field-select';
import { Input } from '../widgets/input';
import { OperatorSelect } from '../widgets/operator-select';
import { Select } from '../widgets/select';
import { SelectMulti } from '../widgets/select-multi/select-multi';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { isBoolean } from '../utils/is-boolean.util';
import { isNumber } from '../utils/is-number.util';
import { isNumberArray } from '../utils/is-number-array.util';
import { isOptionList } from '../utils/is-option-list.util';
import { isString } from '../utils/is-string.util';
import { isStringArray } from '../utils/is-string-array.util';
import { isStringOrNumberArray } from '../utils/is-string-or-number-array.util';
import { isUndefined } from '../utils/is-undefined.util';
import { operatorRequiresValue } from '../utils/operator-requires-value.util';
import { QueryRuleValue } from '../utils/query-tree';
import { removeItem } from '../utils/remove-item.util';

const BooleanContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 2rem;
`;

const FieldsContent = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1.4fr);
  align-items: start;
  width: 100%;
  --query-builder-control-width: 100%;
  --query-builder-control-min-width: 0px;

  ${compactBuilderMedia`
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  `}
`;

const LayoutItem = styled.div`
  min-width: 0;
`;

const ValueContent = styled(LayoutItem)`
  min-width: 0;

  ${compactBuilderMedia`
    grid-column: 1 / -1;
  `}
`;

const ValidationIssues = styled.ul`
  margin: 0.4rem 0 0;
  padding-left: 1rem;
  color: #b42318;
  font-size: 0.75rem;
`;

export interface IRuleProps {
  field: string;
  value?: QueryRuleValue;
  operator?: BuilderFieldOperator;
  id: string;
  readOnly?: boolean;
  dragHandle?: React.ReactNode;
  'data-test'?: string;
}

export const Rule: FC<IRuleProps> = ({
  field: fieldRef,
  value: selectedValue,
  operator,
  id,
  readOnly: localReadOnly = false,
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
    validation,
    showValidation,
  } = useContext(BuilderContext);
  const isReadOnly = readOnly || localReadOnly;
  const RuleContainer = components.Rule || DefaultRuleContainer;
  const Remove = components.Remove || SecondaryButton;
  const validationIssues =
    showValidation && validation?.issuesByRuleId[id]
      ? validation.issuesByRuleId[id]
      : [];

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

  if (typeof fieldRef !== 'string' || fieldRef.trim() === '') {
    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={
          !isReadOnly && <Remove onClick={handleDelete}>{strings.rule.delete}</Remove>
        }
        data-test={dataTest}
      >
        <div>
          <FieldsContent>
            <LayoutItem>
              <FieldSelect selectedValue="" id={id} disabled={isReadOnly} />
            </LayoutItem>
          </FieldsContent>
          {validationIssues.length > 0 && (
            <ValidationIssues>
              {validationIssues.map((issue) => (
                <li key={`${issue.code || issue.message}-${issue.message}`}>
                  {issue.message}
                </li>
              ))}
            </ValidationIssues>
          )}
        </div>
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
    const shouldRenderValueInput = operatorRequiresValue(operator);

    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={
          !isReadOnly && <Remove onClick={handleDelete}>{strings.rule.delete}</Remove>
        }
        data-test={dataTest}
      >
        <div>
          <FieldsContent>
            <LayoutItem>
              <FieldSelect selectedValue={field} id={id} disabled={isReadOnly} />
            </LayoutItem>

            {type === 'BOOLEAN' && (
              <>
                {isOptionList(operatorsOptionList) && (
                  <LayoutItem>
                    <OperatorSelect
                      id={id}
                      values={operatorsOptionList}
                      selectedValue={operator}
                      disabled={isReadOnly}
                    />
                  </LayoutItem>
                )}
                {shouldRenderValueInput && isBoolean(selectedValue) && (
                  <ValueContent>
                    <BooleanContainer>
                      <Boolean
                        id={id}
                        selectedValue={selectedValue}
                        disabled={isReadOnly}
                      />
                    </BooleanContainer>
                  </ValueContent>
                )}
              </>
            )}

            {type === 'LIST' &&
              isOptionList(fieldValue) &&
              isOptionList(operatorsOptionList) && (
                <>
                  <LayoutItem>
                    <OperatorSelect
                      id={id}
                      values={operatorsOptionList}
                      selectedValue={operator}
                      disabled={isReadOnly}
                    />
                  </LayoutItem>
                  {operator &&
                    shouldRenderValueInput &&
                    isString(selectedValue) && (
                      <ValueContent>
                        <Select
                          id={id}
                          selectedValue={selectedValue}
                          values={fieldValue}
                          disabled={isReadOnly}
                        />
                      </ValueContent>
                    )}
                </>
              )}

            {type === 'MULTI_LIST' &&
              isOptionList(fieldValue) &&
              isOptionList(operatorsOptionList) && (
                <>
                  <LayoutItem>
                    <OperatorSelect
                      id={id}
                      values={operatorsOptionList}
                      selectedValue={operator}
                      disabled={isReadOnly}
                    />
                  </LayoutItem>
                  {operator &&
                    shouldRenderValueInput &&
                    isStringArray(selectedValue) && (
                      <ValueContent>
                        <SelectMulti
                          id={id}
                          values={fieldValue}
                          selectedValue={selectedValue}
                          disabled={isReadOnly}
                        />
                      </ValueContent>
                    )}
                </>
              )}

            {type === 'TEXT' && isOptionList(operatorsOptionList) && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isReadOnly}
                  />
                </LayoutItem>
                {operator &&
                  shouldRenderValueInput &&
                  (isString(selectedValue) || isStringArray(selectedValue)) && (
                    <ValueContent>
                      <Input
                        type="text"
                        value={selectedValue}
                        id={id}
                        disabled={isReadOnly}
                      />
                    </ValueContent>
                  )}
              </>
            )}

            {type === 'NUMBER' && isOptionList(operatorsOptionList) && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isReadOnly}
                  />
                </LayoutItem>
                {operator &&
                  shouldRenderValueInput &&
                  (isString(selectedValue) ||
                    isNumber(selectedValue) ||
                    isStringOrNumberArray(selectedValue) ||
                    isNumberArray(selectedValue)) && (
                    <ValueContent>
                      <Input
                        type="number"
                        value={selectedValue}
                        id={id}
                        disabled={isReadOnly}
                      />
                    </ValueContent>
                  )}
              </>
            )}

            {type === 'DATE' && isOptionList(operatorsOptionList) && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isReadOnly}
                  />
                </LayoutItem>
                {!isUndefined(operator) &&
                  shouldRenderValueInput &&
                  (isString(selectedValue) || isStringArray(selectedValue)) && (
                    <ValueContent>
                      <Input
                        type="date"
                        value={selectedValue}
                        id={id}
                        disabled={isReadOnly}
                      />
                    </ValueContent>
                  )}
              </>
            )}
          </FieldsContent>
          {validationIssues.length > 0 && (
            <ValidationIssues>
              {validationIssues.map((issue) => (
                <li key={`${issue.code || issue.message}-${issue.message}`}>
                  {issue.message}
                </li>
              ))}
            </ValidationIssues>
          )}
        </div>
      </RuleContainer>
    );
  } catch (error) {
    console.error(`Field "${fieldRef}" not found in fields definition.`);
  }

  return null;
};
