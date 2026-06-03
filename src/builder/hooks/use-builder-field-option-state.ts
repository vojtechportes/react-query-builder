import { useContext, useSyncExternalStore } from 'react';
import { BuilderContext } from '../../builder-context';
import { IBuilderFieldProps } from '../types';
import { resolveBuilderFieldOptionState } from '../utils/resolve-builder-field-option-state.util';

export const useBuilderFieldOptionState = (
  field: IBuilderFieldProps | undefined
) => {
  const { fieldOptionsStore } = useContext(BuilderContext);
  const fieldName = field?.field;
  const runtimeState = useSyncExternalStore(
    (listener) =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.subscribe(fieldName, listener)
        : () => undefined,
    () =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.getState(fieldName)
        : undefined,
    () =>
      fieldName && fieldOptionsStore
        ? fieldOptionsStore.getState(fieldName)
        : undefined
  );

  return resolveBuilderFieldOptionState(field, runtimeState);
};
