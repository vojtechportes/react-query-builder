import {
  BuilderFieldOption,
  IBuilderFieldOptionState,
} from '../types/field-option';
import { IBuilderFieldOptionsStore } from './builder-field-options-store';

export const createBuilderFieldOptionsStore = (): IBuilderFieldOptionsStore => {
  const fieldStates = new Map<string, IBuilderFieldOptionState>();
  const listenersByField = new Map<string, Set<() => void>>();
  const ruleStates = new Map<string, IBuilderFieldOptionState>();
  const listenersByRule = new Map<string, Set<() => void>>();

  return {
    subscribeField: (field, listener) => {
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
    getFieldState: (field) => fieldStates.get(field),
    setFieldOptions: (field, options) => {
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
    setFieldStatus: (field, status) => {
      const currentState = fieldStates.get(field);

      fieldStates.set(field, {
        options: currentState?.options || [],
        status,
      });

      listenersByField.get(field)?.forEach((listener) => listener());
    },
    invalidateField: (field) => {
      fieldStates.delete(field);
      listenersByField.get(field)?.forEach((listener) => listener());
    },
    clearField: (field) => {
      fieldStates.delete(field);
      listenersByField.get(field)?.forEach((listener) => listener());
    },
    subscribeRule: (ruleId, listener) => {
      const ruleListeners = listenersByRule.get(ruleId) || new Set<() => void>();
      ruleListeners.add(listener);
      listenersByRule.set(ruleId, ruleListeners);

      return () => {
        const currentListeners = listenersByRule.get(ruleId);

        if (!currentListeners) {
          return;
        }

        currentListeners.delete(listener);

        if (currentListeners.size === 0) {
          listenersByRule.delete(ruleId);
        }
      };
    },
    getRuleState: (ruleId) => ruleStates.get(ruleId),
    setRuleOptions: (ruleId, options) => {
      const currentState = ruleStates.get(ruleId);
      const currentOptions = currentState?.options || [];
      const nextOptions =
        typeof options === 'function'
          ? options(currentOptions)
          : options;
      ruleStates.set(ruleId, {
        options: nextOptions as BuilderFieldOption[],
        status: 'success',
      });

      listenersByRule.get(ruleId)?.forEach((listener) => listener());
    },
    setRuleStatus: (ruleId, status) => {
      const currentState = ruleStates.get(ruleId);

      ruleStates.set(ruleId, {
        options: currentState?.options || [],
        status,
      });

      listenersByRule.get(ruleId)?.forEach((listener) => listener());
    },
    invalidateRule: (ruleId) => {
      ruleStates.delete(ruleId);
      listenersByRule.get(ruleId)?.forEach((listener) => listener());
    },
    clearRule: (ruleId) => {
      ruleStates.delete(ruleId);
      listenersByRule.get(ruleId)?.forEach((listener) => listener());
    },
  };
};
