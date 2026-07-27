import React, { FC, useCallback, useContext } from 'react';
import clsx from 'clsx';
import { BuilderFieldOperator, BuilderLockState } from '../..';
import { BuilderContext } from '../../context';
import { CloneButton as DefaultCloneButton } from '../clone-button';
import { createClonedSubtree } from '../../history/utils/create-cloned-subtree.util';
import { createInsertSubtreeAction } from '../../history/utils/create-insert-subtree-action.util';
import { createRemoveSubtreeAction } from '../../history/utils/create-remove-subtree-action.util';
import { createReplaceNodeAction } from '../../history/utils/create-replace-node-action.util';
import { getNodePosition } from '../../history/utils/get-node-position.util';
import { LockToggle as DefaultLockToggle } from '../lock-toggle';
import { Rule as DefaultRuleContainer } from './components/rule-container';
import { SecondaryButton } from '../secondary-button';
import { Boolean } from '../rule-controls/boolean';
import { FieldSelect } from '../rule-controls/field-select';
import { Input } from '../rule-controls/input';
import { OperatorSelect } from '../rule-controls/operator-select';
import { Select } from '../rule-controls/select';
import { SelectMulti } from '../rule-controls/select-multi/select-multi';
import { ValueFieldSelect } from '../rule-controls/value-field-select';
import { ValueSourceSelect } from '../rule-controls/value-source-select';
import { isBoolean } from '../../utils/is-boolean.util';
import {
  getCompatibleValueFields,
  supportsFieldComparisonForOperator,
} from '../../utils/field-comparison-support.util';
import { isNumber } from '../../utils/is-number.util';
import { isNumberArray } from '../../utils/is-number-array.util';
import { isOptionList } from '../../utils/is-option-list.util';
import { isString } from '../../utils/is-string.util';
import { isStringArray } from '../../utils/is-string-array.util';
import { isStringOrNumberArray } from '../../utils/is-string-or-number-array.util';
import { operatorRequiresValue } from '../../../shared/query/model/utils/operator-requires-value.util';
import { isNormalizedGroupNode } from '../../../shared/query/model/utils/is-normalized-group-node.util';
import {
  QueryRuleValue,
  QueryRuleValueSource,
  RuleReadOnlyTarget,
} from '../../../shared/query/model/types/query-tree';
import { getCloneButtonTitle } from '../../utils/get-clone-button-title.util';
import { getLockToggleTitle } from '../../utils/get-lock-toggle-title.util';
import { isNodeDeletionProtected } from '../../read-only/utils/is-node-deletion-protected.util';
import { updateRuleLockState } from '../../read-only/utils/update-rule-lock-state.util';
import { getRuleValueSource } from '../../../shared/query/model/utils/rule-value-source.util';
import { useBuilderFieldOptionState } from '../../hooks/use-builder-field-option-state';
import styles from './rule.module.css';

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
  const isOperatorReadOnly = isReadOnly || readOnlyTargets.includes('operator');
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

      if (
        !dispatchAction ||
        !currentRule ||
        isNormalizedGroupNode(currentRule)
      ) {
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
        {canDeleteRule ? (
          <Remove onClick={handleDelete}>{strings.rule.delete}</Remove>
        ) : null}
        {cloneControl}
        {lockControl}
      </>
    ) : null;

  const fieldConfig =
    typeof fieldRef === 'string' && fieldRef.trim() !== ''
      ? fields.find((item) => item.field === fieldRef)
      : undefined;
  const fieldOptionState = useBuilderFieldOptionState(fieldConfig, id);

  if (typeof fieldRef !== 'string' || fieldRef.trim() === '') {
    return (
      <RuleContainer
        dragHandle={dragHandle}
        controls={controls}
        className={clsx(isReadOnly && styles.readOnly)}
        data-test={dataTest}
      >
        <div>
          <div className={styles.fieldsContent}>
            <div className={styles.layoutItem}>
              <FieldSelect
                selectedValue=""
                id={id}
                disabled={isFieldReadOnly}
              />
            </div>
          </div>
          {validationIssues.length > 0 && (
            <ul className={styles.validationIssues}>
              {validationIssues.map((issue) => (
                <li key={`${issue.code || issue.message}-${issue.message}`}>
                  {issue.message}
                </li>
              ))}
            </ul>
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
    operators.map((item) => ({
      value: item,
      label: (strings.operators && strings.operators[item]) || item,
    }));
  const shouldRenderValueInput = operatorRequiresValue(operator);
  const resolvedValueSource = getRuleValueSource({ valueSource });
  const compatibleValueFields = getCompatibleValueFields(
    fields,
    fieldConfig,
    operator
  );
  const supportsFieldComparison =
    (allowFieldComparisons &&
      supportsFieldComparisonForOperator(fieldConfig, operator)) ||
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
        <div className={styles.booleanContainer}>
          <Boolean
            id={id}
            selectedValue={selectedValue}
            disabled={isValueReadOnly}
          />
        </div>
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
      className={clsx(isReadOnly && styles.readOnly)}
      data-test={dataTest}
    >
      <div>
        <div className={styles.fieldsContent}>
          <div className={styles.layoutItem}>
            <FieldSelect
              selectedValue={field}
              id={id}
              disabled={isFieldReadOnly}
            />
          </div>

          {type === 'BOOLEAN' && (
            <>
              {isOptionList(operatorsOptionList) && (
                <div className={styles.layoutItem}>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </div>
              )}
              {shouldRenderValueInput && (
                <div className={styles.valueContent}>
                  {supportsFieldComparison ? (
                    <div className={styles.valueEditorGrid}>
                      <ValueSourceSelect
                        id={id}
                        field={fieldConfig}
                        selectedValueSource={resolvedValueSource}
                        compatibleFields={compatibleValueFields}
                        fieldComparisonEnabled={allowFieldComparisons}
                        disabled={isValueReadOnly}
                      />
                      {renderValueEditor()}
                    </div>
                  ) : (
                    renderValueEditor()
                  )}
                </div>
              )}
            </>
          )}

          {type === 'LIST' &&
            isOptionList(fieldValue) &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <div className={styles.layoutItem}>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </div>
                {shouldRenderValueInput && (
                  <div className={styles.valueContent}>
                    {supportsFieldComparison ? (
                      <div className={styles.valueEditorGrid}>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </div>
                    ) : (
                      renderValueEditor()
                    )}
                  </div>
                )}
              </>
            )}

          {type === 'MULTI_LIST' &&
            isOptionList(fieldValue) &&
            isOptionList(operatorsOptionList) && (
              <>
                <div className={styles.layoutItem}>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </div>
                {operator && shouldRenderValueInput && (
                  <div className={styles.valueContent}>
                    {renderValueEditor()}
                  </div>
                )}
              </>
            )}

          {type === 'TEXT' && isOptionList(operatorsOptionList) && operator && (
            <>
              <div className={styles.layoutItem}>
                <OperatorSelect
                  id={id}
                  values={operatorsOptionList}
                  selectedValue={operator}
                  disabled={isOperatorReadOnly}
                />
              </div>
              {shouldRenderValueInput && (
                <div className={styles.valueContent}>
                  {supportsFieldComparison ? (
                    <div className={styles.valueEditorGrid}>
                      <ValueSourceSelect
                        id={id}
                        field={fieldConfig}
                        selectedValueSource={resolvedValueSource}
                        compatibleFields={compatibleValueFields}
                        fieldComparisonEnabled={allowFieldComparisons}
                        disabled={isValueReadOnly}
                      />
                      {renderValueEditor()}
                    </div>
                  ) : (
                    renderValueEditor()
                  )}
                </div>
              )}
            </>
          )}

          {type === 'DATE' && isOptionList(operatorsOptionList) && operator && (
            <>
              <div className={styles.layoutItem}>
                <OperatorSelect
                  id={id}
                  values={operatorsOptionList}
                  selectedValue={operator}
                  disabled={isOperatorReadOnly}
                />
              </div>
              {shouldRenderValueInput && (
                <div className={styles.valueContent}>
                  {supportsFieldComparison ? (
                    <div className={styles.valueEditorGrid}>
                      <ValueSourceSelect
                        id={id}
                        field={fieldConfig}
                        selectedValueSource={resolvedValueSource}
                        compatibleFields={compatibleValueFields}
                        fieldComparisonEnabled={allowFieldComparisons}
                        disabled={isValueReadOnly}
                      />
                      {renderValueEditor()}
                    </div>
                  ) : (
                    renderValueEditor()
                  )}
                </div>
              )}
            </>
          )}

          {type === 'NUMBER' &&
            isOptionList(operatorsOptionList) &&
            operator && (
              <>
                <div className={styles.layoutItem}>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                    disabled={isOperatorReadOnly}
                  />
                </div>
                {shouldRenderValueInput && (
                  <div className={styles.valueContent}>
                    {supportsFieldComparison ? (
                      <div className={styles.valueEditorGrid}>
                        <ValueSourceSelect
                          id={id}
                          field={fieldConfig}
                          selectedValueSource={resolvedValueSource}
                          compatibleFields={compatibleValueFields}
                          fieldComparisonEnabled={allowFieldComparisons}
                          disabled={isValueReadOnly}
                        />
                        {renderValueEditor()}
                      </div>
                    ) : (
                      renderValueEditor()
                    )}
                  </div>
                )}
              </>
            )}
        </div>
        {validationIssues.length > 0 && (
          <ul className={styles.validationIssues}>
            {validationIssues.map((issue) => (
              <li key={`${issue.code || issue.message}-${issue.message}`}>
                {issue.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </RuleContainer>
  );
};
