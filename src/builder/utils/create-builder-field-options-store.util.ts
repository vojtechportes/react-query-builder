import {
  BuilderFieldOption,
  IBuilderFieldOptionState,
} from '../types/field-option';
import { IBuilderFieldOptionsStore } from './builder-field-options-store';

export const createBuilderFieldOptionsStore = (): IBuilderFieldOptionsStore => {
  const fieldStates = new Map<string, IBuilderFieldOptionState>();
  const listenersByField = new Map<string, Set<() => void>>();

  return {
    subscribe: (field, listener) => {
      const fieldListeners = listenersByField.get(field) || new Set<() => void>();
      fieldListeners.add(listener);
      listenersByField.set(field, fieldListeners);

      return () => {
        const currentListeners = listenersByField.get(field);

        if (!currentListeners) {
          return;
        }

        currentListeners.delete(listener);

        if (currentListeners.size === 0) {
          listenersByField.delete(field);
        }
      };
    },
    getState: (field) => fieldStates.get(field),
    setOptions: (field, options) => {
      const currentState = fieldStates.get(field);
      const currentOptions = currentState?.options || [];
      const nextOptions =
        typeof options === 'function'
          ? options(currentOptions)
          : options;
      fieldStates.set(field, {
        options: nextOptions as BuilderFieldOption[],
        status: 'success',
      });

      listenersByField.get(field)?.forEach((listener) => listener());
    },
    setStatus: (field, status) => {
      const currentState = fieldStates.get(field);

      fieldStates.set(field, {
        options: currentState?.options || [],
        status,
      });

      listenersByField.get(field)?.forEach((listener) => listener());
    },
    invalidate: (field) => {
      fieldStates.delete(field);
      listenersByField.get(field)?.forEach((listener) => listener());
    },
    clear: (field) => {
      fieldStates.delete(field);
      listenersByField.get(field)?.forEach((listener) => listener());
    },
  };
};
