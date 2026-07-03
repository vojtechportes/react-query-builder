import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { BuilderFieldOperator, BuilderLockState } from '../builder';
import { BuilderContext } from '../builder-context';
import { CloneButton as DefaultCloneButton } from '../clone-button';
import { createClonedSubtree } from '../history/create-cloned-subtree';
import { createInsertSubtreeAction } from '../history/create-insert-subtree-action';
import { createRemoveSubtreeAction } from '../history/create-remove-subtree-action';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { getNodePosition } from '../history/get-node-position';
import { LockToggle as DefaultLockToggle } from '../lock-toggle';
import { Rule as DefaultRuleContainer } from './rule-container';
import { SecondaryButton } from '../secondary-button';
import { compactBuilderMedia } from '../styles/responsive.styles';
import { Boolean } from '../widgets/boolean';
import { FieldSelect } from '../widgets/field-select';
import { Input } from '../widgets/input';
import { OperatorSelect } from '../widgets/operator-select';
import { Select } from '../widgets/select';
import { SelectMulti } from '../widgets/select-multi/select-multi';
import { ValueFieldSelect } from '../widgets/value-field-select';
import { ValueSourceSelect } from '../widgets/value-source-select';
import { isBoolean } from '../utils/is-boolean.util';
import { getCompatibleValueFields, supportsFieldComparisonForOperator } from '../utils/field-comparison-support';
import { isNumber } from '../utils/is-number.util';
import { isNumberArray } from '../utils/is-number-array.util';
import { isOptionList } from '../utils/is-option-list.util';
import { isString } from '../utils/is-string.util';
import { isStringArray } from '../utils/is-string-array.util';
import { isStringOrNumberArray } from '../utils/is-string-or-number-array.util';
import { operatorRequiresValue } from '../utils/operator-requires-value.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { QueryRuleValue, QueryRuleValueSource, RuleReadOnlyTarget } from '../utils/query-tree';
import { getCloneButtonTitle } from '../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../utils/get-lock-toggle-title.util';
import { isNodeDeletionProtected } from '../utils/is-node-deletion-protected.util';
import { updateRuleLockState } from '../utils/read-only/update-rule-lock-state.util';
import { getRuleValueSource } from '../utils/rule-value-source';
import { useBuilderFieldOptionState } from '../builder/hooks/use-builder-field-option-state';

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

const ValueEditorGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);

  ${compactBuilderMedia`
    grid-template-columns: 1fr;
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
  valueSource?: QueryRuleValueSource;
  valueField?: string;
  operator?: BuilderFieldOperator;
  id: string;
  readOnly?: boolean;
  readOnlyTargets?: RuleReadOnlyTarget[];
  lockState?: BuilderLockState;
  lockDisabled?: boolean;
  dragHandle?: React.ReactNode;
  'data-test'?: string;
}

export const Rule: FC<IRuleProps> = ({
  field: fieldRef,
  value: selectedValue,
  valueSource,
  valueField,
  operator,
  id,
  readOnly: localReadOnly = false,
  readOnlyTargets = [],
  lockState = localReadOnly ? 'self' : 'unlocked',
  lockDisabled = false,
  dragHandle,
  'data-test': dataTest,
}) => {
  const {
    fields,
    data,
    dispatchAction,
    components,
    strings,
    readOnly,
    allowFieldComparisons = false,
    readOnlyProtectsDelete = true,
    cloneable,
    lockable,
    validation,
    showValidation,
  } = useContext(BuilderContext);
  const isReadOnly = readOnly || localReadOnly;
  const isFieldReadOnly = isReadOnly || readOnlyTargets.includes('field');
  const isOperatorReadOnly =
    isReadOnly || readOnlyTargets.includes('operator');
  const isValueReadOnly = isReadOnly || readOnlyTargets.includes('value');
  const RuleContainer = components.Rule || DefaultRuleContainer;
  const CloneButton = components.CloneButton || DefaultCloneButton;
  const LockToggle = components.LockToggle || DefaultLockToggle;
  const Remove = components.Remove || SecondaryButton;
  const validationIssues =
    showValidation && validation?.issuesByRuleId[id]
      ? validation.issuesByRuleId[id]
      : [];
  const hasReadOnlyTargets = readOnlyTargets.length > 0;
  const canDeleteRule =
    !isReadOnly &&
    !hasReadOnlyTargets &&
    (!readOnlyProtectsDelete || !isNodeDeletionProtected(data, id));

  const handleDelete = useCallback(() => {
    if (!canDeleteRule) {
      return;
    }

    dispatchAction?.(createRemoveSubtreeAction(id));
  }, [canDeleteRule, dispatchAction, id]);

  const handleChangeLockState = useCallback(
    (nextState: BuilderLockState) => {
      const currentRule = data.find((item) => item.id === id);

      if (!dispatchAction || !currentRule || isNormalizedGroupNode(currentRule)) {
        return;
      }

      const nextRule = { ...currentRule };
      const nextReadOnly = updateRuleLockState(
        currentRule.readOnly,
        nextState === 'self' ? 'self' : 'unlocked'
      );

      if (typeof nextReadOnly === 'undefined') {
        delete nextRule.readOnly;
      } else {
        nextRule.readOnly = nextReadOnly;
      }

      dispatchAction(createReplaceNodeAction(id, nextRule));
    },
    [data, dispatchAction, id]
  );

  const handleClone = useCallback(() => {
    const currentPosition = getNodePosition(data, id);

    if (!dispatchAction || !currentPosition) {
      return;
    }

    dispatchAction(
      createInsertSubtreeAction(
        createClonedSubtree(data, id),
        currentPosition.index + 1,
        currentPosition.parentId
      )
    );
  }, [data, dispatchAction, id]);

  const cloneControl =
    cloneable && !isReadOnly ? (
      <CloneButton
        nodeType="rule"
        onClick={handleClone}
        title={getCloneButtonTitle(strings, 'rule')}
        data-test="CloneButton[rule]"
      />
    ) : null;

  const lockControl =
    lockable && !readOnly ? (
      <LockToggle
        state={lockState}
        nodeType="rule"
        disabled={lockDisabled}
        onChange={handleChangeLockState}
        title={getLockToggleTitle(strings, 'rule', lockState)}
        data-test="LockToggle[rule]"
      />
    ) : null;

  if (!fields || !strings.rule) {
    return null;
  }

  const controls =
    !isReadOnly || lockControl ? (
      <>
        {canDeleteRule ? <Remove onClick={handleDelete}>{strings.rule.delete}</Remove> : null}
        {cloneControl}
        {lockControl}
      </>
    ) : null;

  const fieldConfig =
    typeof fieldRef === 'string' && fieldRef.trim() !== ''
      ? fields.find(item => item.field === fieldRef)
      : undefined;
  const fieldOptionState = useBuilderFieldOptionState(fieldConfig, id);

  if (typeof fieldRef !== 'string' || fieldRef.trim() === '') {
    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={controls}
        data-test={dataTest}
      >
        <div>
          <FieldsContent>
            <LayoutItem>
              <FieldSelect
                selectedValue=""
                id={id}
                disabled={isFieldReadOnly}
              />
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

  if (!fieldConfig) {
    return null;
  }

  const { field, operators, type } = fieldConfig;
  const fieldValue = fieldOptionState.options;
  const operatorsOptionList =
    operators &&
    operators.map(item => ({
      value: item,
      label: (strings.operators && strings.operators[item]) || item,
    }));
  const shouldRenderValueInput = operatorRequiresValue(operator);
  const resolvedValueSource = getRuleValueSource({ valueSource });
  const compatibleValueFields = getCompatibleValueFields(fields, fieldConfig, operator);
  const supportsFieldComparison =
    (allowFieldComparisons && supportsFieldComparisonForOperator(fieldConfig, operator)) ||
    resolvedValueSource === 'field';
  const usesFieldComparison = resolvedValueSource === 'field';

  const renderValueEditor = () => {
    if (!shouldRenderValueInput) {
      return null;
    }

    if (type === 'BOOLEAN') {
      if (usesFieldComparison) {
        return compatibleValueFields.length > 0 ? (
          <ValueFieldSelect
            id={id}
            selectedValue={valueField}
            compatibleFields={compatibleValueFields}
            disabled={isValueReadOnly}
          />
        ) : null;
      }

      return isBoolean(selectedValue) ? (
        <BooleanContainer>
          <Boolean
            id={id}
            selectedValue={selectedValue}
            disabled={isValueReadOnly}
          />
        </BooleanContainer>
      ) : null;
    }

    if (type === 'TEXT') {
      if (usesFieldComparison) {
        return compatibleValueFields.length > 0 ? (
          <ValueFieldSelect
            id={id}
            selectedValue={valueField}
            compatibleFields={compatibleValueFields}
            disabled={isValueReadOnly}
          />
        ) : null;
      }

      return isString(selectedValue) ? (
        <Input
          id={id}
          type="text"
          value={selectedValue}
          disabled={isValueReadOnly}
        />
      ) : null;
    }

    if (type === 'DATE') {
      if (usesFieldComparison) {
        return compatibleValueFields.length > 0 ? (
          <ValueFieldSelect
            id={id}
            selectedValue={valueField}
            compatibleFields={compatibleValueFields}
            disabled={isValueReadOnly}
          />
        ) : null;
      }

      return isString(selectedValue) || isStringOrNumberArray(selectedValue) ? (
        <Input
          id={id}
          type="date"
          value={selectedValue}
          disabled={isValueReadOnly}
        />
      ) : null;
    }

    if (type === 'NUMBER') {
      if (usesFieldComparison) {
        return compatibleValueFields.length > 0 ? (
          <ValueFieldSelect
            id={id}
            selectedValue={valueField}
            compatibleFields={compatibleValueFields}
            disabled={isValueReadOnly}
          />
        ) : null;
      }

      return isNumber(selectedValue) || isNumberArray(selectedValue) ? (
        <Input
          id={id}
          type="number"
          value={selectedValue}
          disabled={isValueReadOnly}
        />
      ) : null;
    }

    if (type === 'LIST' && isOptionList(fieldValue)) {
      if (usesFieldComparison) {
        return compatibleValueFields.length > 0 ? (
          <ValueFieldSelect
            id={id}
            selectedValue={valueField}
            compatibleFields={compatibleValueFields}
            disabled={isValueReadOnly}
          />
        ) : null;
      }

      return (
        <Select
          id={id}
          selectedValue={isString(selectedValue) ? selectedValue : ''}
          values={fieldValue}
          disabled={isValueReadOnly}
        />
      );
    }

    if (type === 'MULTI_LIST' && isOptionList(fieldValue)) {
      return (
        <SelectMulti
          id={id}
          values={fieldValue}
          selectedValue={isStringArray(selectedValue) ? selectedValue : []}
          disabled={isValueReadOnly}
        />
      );
    }

    return null;
  };

  return (
    <RuleContainer
      dragHandle={dragHandle}
      controls={controls}
      data-test={dataTest}
    >
      <div>
        <FieldsContent>
          <LayoutItem>
            <FieldSelect
              selectedValue={field}
              id={id}
              disabled={isFieldReadOnly}
            />
          </LayoutItem>

          {type === 'BOOLEAN' && (
            <>
              {isOptionList(operatorsOptionList) && (
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
              )}
              {shouldRenderValueInput && (
                <ValueContent>
                  {supportsFieldComparison ? (
                    <ValueEditorGrid>
                      <ValueSourceSelect
                        id={id}
                        field={fieldConfig}
                        selectedValueSource={resolvedValueSource}
                        compatibleFields={compatibleValueFields}
                        fieldComparisonEnabled={allowFieldComparisons}
                        disabled={isValueReadOnly}
                      />
                      {renderValueEditor()}
                    </ValueEditorGrid>
                  ) : (
                    renderValueEditor()
                  )}
                </ValueContent>
              )}
            </>
          )}

          {type === 'LIST' &&
            isOptionList(fieldValue) &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
                {shouldRenderValueInput && (
                  <ValueContent>
                    {supportsFieldComparison ? (
                      <ValueEditorGrid>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </ValueEditorGrid>
                    ) : (
                      renderValueEditor()
                    )}
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
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
                {operator && shouldRenderValueInput && (
                  <ValueContent>
                    {renderValueEditor()}
                  </ValueContent>
                )}
              </>
            )}

          {type === 'TEXT' &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
                {shouldRenderValueInput && (
                  <ValueContent>
                    {supportsFieldComparison ? (
                      <ValueEditorGrid>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </ValueEditorGrid>
                    ) : (
                      renderValueEditor()
                    )}
                  </ValueContent>
                )}
              </>
            )}

          {type === 'DATE' &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
                {shouldRenderValueInput && (
                  <ValueContent>
                    {supportsFieldComparison ? (
                      <ValueEditorGrid>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </ValueEditorGrid>
                    ) : (
                      renderValueEditor()
                    )}
                  </ValueContent>
                )}
              </>
            )}

          {type === 'NUMBER' &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <LayoutItem>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </LayoutItem>
                {shouldRenderValueInput && (
                  <ValueContent>
                    {supportsFieldComparison ? (
                      <ValueEditorGrid>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </ValueEditorGrid>
                    ) : (
                      renderValueEditor()
                    )}
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
};

