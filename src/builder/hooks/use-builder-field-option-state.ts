import { useContext, useSyncExternalStore } from 'react';
import { BuilderContext } from '../../builder-context';
import { IBuilderFieldProps } from '../types';
import { resolveBuilderFieldOptionState } from '../utils/resolve-builder-field-option-state.util';

export const useBuilderFieldOptionState = (
  field: IBuilderFieldProps | undefined,
  ruleId?: string
) => {
  const { fieldOptionsStore } = useContext(BuilderContext);
  const fieldName = field?.field;
  const fieldRuntimeState = useSyncExternalStore(
    (listener) =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.subscribeField(fieldName, listener)
        : () => undefined,
    () =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.getFieldState(fieldName)
        : undefined,
    () =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.getFieldState(fieldName)
        : undefined
  );
  const ruleRuntimeState = useSyncExternalStore(
    (listener) =>
      ruleId && fieldOptionsStore
        ? fieldOptionsStore.subscribeRule(ruleId, listener)
        : () => undefined,
    () =>
      ruleId && fieldOptionsStore
        ? fieldOptionsStore.getRuleState(ruleId)
        : undefined,
    () =>
      ruleId && fieldOptionsStore
        ? fieldOptionsStore.getRuleState(ruleId)
        : undefined
  );

  return resolveBuilderFieldOptionState(field, fieldRuntimeState, ruleRuntimeState);
};
