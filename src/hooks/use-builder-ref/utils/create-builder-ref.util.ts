import {
  BuilderRef,
  BuilderRefListener,
  IBuilderRef,
  IBuilderRuleOptionsBindingConfig,
} from '../types';
import { areBuilderRuleDependencyEntriesEqual } from './are-builder-rule-dependency-entries-equal.util';
import { areBuilderFieldOptionStatesEqual } from './are-builder-field-option-states-equal.util';
import { createBuilderRuleDependencyEntries } from './create-builder-rule-dependency-entries.util';
import { isSameQuery } from '../../../utils/is-same-query.util';

export const createBuilderRef = (): BuilderRef => {
  let current: IBuilderRef | null = null;
  const listeners = new Set<BuilderRefListener>();
  let isNotificationScheduled = false;
  const subscribeToRuleDependencies: BuilderRef['subscribeToRuleDependencies'] = (
    field,
    dependencyFields,
    listener
  ) => {
    let previousData = current?.getData();
    let previousEntries =
      current
        ? createBuilderRuleDependencyEntries(current, field, dependencyFields)
        : [];

    if (current) {
      listener(previousEntries);
    }

    const builderListener: BuilderRefListener = (builder) => {
      if (!builder) {
        previousData = undefined;
        previousEntries = [];
        return;
      }

      const nextData = builder.getData();

      if (previousData && isSameQuery(previousData, nextData)) {
        return;
      }

      const nextEntries = createBuilderRuleDependencyEntries(
        builder,
        field,
        dependencyFields
      );

      if (areBuilderRuleDependencyEntriesEqual(previousEntries, nextEntries)) {
        previousData = nextData;
        return;
      }

      previousData = nextData;
      previousEntries = nextEntries;
      listener(nextEntries);
    };

    listeners.add(builderListener);

    return () => {
      listeners.delete(builderListener);
    };
  };
  const bindRuleOptions: BuilderRef['bindRuleOptions'] = (
    field,
    config: IBuilderRuleOptionsBindingConfig
  ) => {
    const abortControllersByRuleId = new Map<string, AbortController>();
    let activeRuleIds = new Set<string>();
    let previousEntries =
      current
        ? createBuilderRuleDependencyEntries(current, field, config.dependencies)
        : [];
    let hasSyncedEntries = false;

    const stopRuleLoad = (ruleId: string) => {
      const controller = abortControllersByRuleId.get(ruleId);

      if (!controller) {
        return;
      }

      controller.abort();
      abortControllersByRuleId.delete(ruleId);
    };

    const stopAllRuleLoads = () => {
      abortControllersByRuleId.forEach((controller) => controller.abort());
      abortControllersByRuleId.clear();
    };

    const runResolver = async (
      entry: ReturnType<typeof createBuilderRuleDependencyEntries>[number]
    ) => {
      const builder = current;

      if (!builder) {
        return;
      }

      const hasMissingDependencies = config.dependencies.some(
        (dependencyField) => !entry.dependencies[dependencyField]
      );

      stopRuleLoad(entry.ruleId);

      if (hasMissingDependencies && config.clearOnMissingDependencies !== false) {
        builder.clearRuleOptions(entry.ruleId);
        return;
      }

      const controller = new AbortController();
      abortControllersByRuleId.set(entry.ruleId, controller);
      builder.setRuleOptionsStatus(entry.ruleId, 'loading');

      try {
        const options = await config.resolve({
          ruleId: entry.ruleId,
          field,
          dependencies: entry.dependencies,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        current?.setRuleOptions(entry.ruleId, options);
        config.onOptionsResolved?.({
          ruleId: entry.ruleId,
          field,
          dependencies: entry.dependencies,
          options,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        current?.setRuleOptionsStatus(entry.ruleId, 'error');
        config.onError?.(error, {
          ruleId: entry.ruleId,
          field,
          dependencies: entry.dependencies,
        });
      } finally {
        if (abortControllersByRuleId.get(entry.ruleId) === controller) {
          abortControllersByRuleId.delete(entry.ruleId);
        }
      }
    };

    const handleEntries = (
      entries: ReturnType<typeof createBuilderRuleDependencyEntries>
    ) => {
      const nextRuleIds = new Set(entries.map((entry) => entry.ruleId));

      activeRuleIds.forEach((ruleId) => {
        if (nextRuleIds.has(ruleId)) {
          return;
        }

        stopRuleLoad(ruleId);
        current?.clearRuleOptions(ruleId);
      });

      activeRuleIds = nextRuleIds;
      entries.forEach((entry) => {
        void runResolver(entry);
      });
    };

    const bindListener: BuilderRefListener = (builder) => {
      if (!builder) {
        previousEntries = [];
        hasSyncedEntries = false;
        return;
      }

      const nextEntries = createBuilderRuleDependencyEntries(
        builder,
        field,
        config.dependencies
      );

      if (
        hasSyncedEntries &&
        areBuilderRuleDependencyEntriesEqual(previousEntries, nextEntries)
      ) {
        return;
      }

      previousEntries = nextEntries;
      hasSyncedEntries = true;
      handleEntries(nextEntries);
    };

    listeners.add(bindListener);
    bindListener(current);

    return () => {
      listeners.delete(bindListener);
      stopAllRuleLoads();
    };
  };

  return {
    get current() {
      return current;
    },
    set current(nextCurrent: IBuilderRef | null) {
      current = nextCurrent;

      if (isNotificationScheduled) {
        return;
      }

      isNotificationScheduled = true;

      queueMicrotask(() => {
        isNotificationScheduled = false;
        listeners.forEach((listener) => {
          listener(current);
        });
      });
    },
    subscribe: (listener) => {
      listeners.add(listener);
      listener(current);

      return () => {
        listeners.delete(listener);
      };
    },
    bindRuleOptions,
    subscribeToRuleDependencies,
    subscribeToFieldDependencies: subscribeToRuleDependencies,
    reconcileRuleValueWithOptions: (ruleId, config) =>
      current?.reconcileRuleValueWithOptions(ruleId, config) || false,
    subscribeToFieldOptionState: (field, listener) => {
      let previousState = current?.getFieldOptionState(field);
      let unsubscribeFromCurrentBuilder = current
        ? current.subscribeToFieldOptionState(field, (state) => {
            previousState = state;
            listener(state);
          })
        : undefined;

      const builderListener: BuilderRefListener = (builder) => {
        if (!builder) {
          unsubscribeFromCurrentBuilder?.();
          previousState = undefined;
          unsubscribeFromCurrentBuilder = undefined;
          return;
        }

        const nextState = builder.getFieldOptionState(field);

        if (
          unsubscribeFromCurrentBuilder &&
          previousState &&
          areBuilderFieldOptionStatesEqual(previousState, nextState)
        ) {
          return;
        }

        unsubscribeFromCurrentBuilder?.();
        previousState = nextState;

        unsubscribeFromCurrentBuilder = builder.subscribeToFieldOptionState(
          field,
          (state) => {
            if (
              previousState &&
              areBuilderFieldOptionStatesEqual(previousState, state)
            ) {
              return;
            }

            previousState = state;
            listener(state);
          }
        );
      };

      listeners.add(builderListener);

      return () => {
        unsubscribeFromCurrentBuilder?.();
        listeners.delete(builderListener);
      };
    },
    subscribeToRuleOptionState: (ruleId, listener) => {
      let previousState = current?.getRuleOptionState(ruleId);
      let unsubscribeFromCurrentBuilder = current
        ? current.subscribeToRuleOptionState(ruleId, (state) => {
            previousState = state;
            listener(state);
          })
        : undefined;

      const builderListener: BuilderRefListener = (builder) => {
        if (!builder) {
          unsubscribeFromCurrentBuilder?.();
          previousState = undefined;
          unsubscribeFromCurrentBuilder = undefined;
          return;
        }

        const nextState = builder.getRuleOptionState(ruleId);

        if (
          unsubscribeFromCurrentBuilder &&
          previousState &&
          areBuilderFieldOptionStatesEqual(previousState, nextState)
        ) {
          return;
        }

        unsubscribeFromCurrentBuilder?.();
        previousState = nextState;

        unsubscribeFromCurrentBuilder = builder.subscribeToRuleOptionState(
          ruleId,
          (state) => {
            if (
              previousState &&
              areBuilderFieldOptionStatesEqual(previousState, state)
            ) {
              return;
            }

            previousState = state;
            listener(state);
          }
        );
      };

      listeners.add(builderListener);

      return () => {
        unsubscribeFromCurrentBuilder?.();
        listeners.delete(builderListener);
      };
    },
  };
};
