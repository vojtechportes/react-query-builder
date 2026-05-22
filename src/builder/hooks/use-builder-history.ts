import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { applyHistoryAction } from '../../history/apply-history-action';
import { createBuilderHistoryState } from '../../history/create-builder-history-state';
import {
  BuilderHistoryAction,
  IBuilderHistoryConfig,
  IBuilderHistoryState,
} from '../../history/types';
import { NormalizedQuery } from '../../utils/query-tree';

export interface IUseBuilderHistoryArgs {
  data: NormalizedQuery;
  setData: Dispatch<SetStateAction<NormalizedQuery>>;
  history: boolean | IBuilderHistoryConfig;
}

export const useBuilderHistory = ({
  data,
  setData,
  history,
}: IUseBuilderHistoryArgs) => {
  const resolvedHistoryConfig =
    history && typeof history === 'object' ? history : history ? {} : null;
  const historyEnabled = Boolean(history);
  const historyMaxEntries = resolvedHistoryConfig?.maxEntries || 50;
  const showHistoryControls =
    historyEnabled && resolvedHistoryConfig?.controls !== false;
  const [historyState, setHistoryState] = useState<IBuilderHistoryState>(() =>
    createBuilderHistoryState()
  );
  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  const commitData = useCallback(
    (
      action: BuilderHistoryAction,
      options: { trackHistory?: boolean } = {}
    ): boolean => {
      const appliedAction = applyHistoryAction(data, action);

      if (!appliedAction) {
        return false;
      }

      setData(appliedAction.data);

      if (options.trackHistory !== false && historyEnabled) {
        setHistoryState((currentHistory) => ({
          past: [
            ...currentHistory.past.slice(-(historyMaxEntries - 1)),
            {
              undo: appliedAction.inverse,
              redo: action,
            },
          ],
          future: [],
        }));
      }

      return true;
    },
    [data, historyEnabled, historyMaxEntries, setData]
  );

  const dispatchAction = useCallback(
    (action: BuilderHistoryAction) => {
      commitData(action);
    },
    [commitData]
  );

  const undo = useCallback(() => {
    if (!historyEnabled) {
      return;
    }

    const entry = historyState.past[historyState.past.length - 1];

    if (!entry) {
      return;
    }

    if (!commitData(entry.undo, { trackHistory: false })) {
      return;
    }

    setHistoryState((currentHistory) => ({
      past: currentHistory.past.slice(0, -1),
      future: [entry, ...currentHistory.future],
    }));
  }, [commitData, historyEnabled, historyState.past]);

  const redo = useCallback(() => {
    if (!historyEnabled) {
      return;
    }

    const entry = historyState.future[0];

    if (!entry) {
      return;
    }

    if (!commitData(entry.redo, { trackHistory: false })) {
      return;
    }

    setHistoryState((currentHistory) => ({
      past: [...currentHistory.past, entry],
      future: currentHistory.future.slice(1),
    }));
  }, [commitData, historyEnabled, historyState.future]);

  const resetHistory = useCallback(() => {
    setHistoryState(createBuilderHistoryState());
  }, []);

  return {
    canRedo,
    canUndo,
    commitData,
    dispatchAction,
    historyEnabled,
    historyState,
    redo,
    resetHistory,
    showHistoryControls,
    undo,
  };
};
