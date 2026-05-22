import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { clone } from '../../utils/clone.util';
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
  const dataRef = useRef(data);
  const historyStateRef = useRef(historyState);
  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  dataRef.current = data;
  historyStateRef.current = historyState;

  const commitData = useCallback(
    (
      action: BuilderHistoryAction,
      options: { trackHistory?: boolean } = {}
    ): boolean => {
      const appliedAction = applyHistoryAction(dataRef.current, action);

      if (!appliedAction) {
        return false;
      }

      dataRef.current = appliedAction.data;
      setData(appliedAction.data);

      if (options.trackHistory !== false && historyEnabled) {
        const nextHistory = {
          past: [
            ...historyStateRef.current.past.slice(-(historyMaxEntries - 1)),
            {
              undo: appliedAction.inverse,
              redo: action,
            },
          ],
          future: [],
        };

        historyStateRef.current = nextHistory;
        setHistoryState(nextHistory);
      }

      return true;
    },
    [historyEnabled, historyMaxEntries, setData]
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

    const currentHistory = historyStateRef.current;
    const entry = currentHistory.past[currentHistory.past.length - 1];

    if (!entry) {
      return;
    }

    if (!commitData(entry.undo, { trackHistory: false })) {
      return;
    }

    const nextHistory = {
      past: currentHistory.past.slice(0, -1),
      future: [entry, ...currentHistory.future],
    };

    historyStateRef.current = nextHistory;
    setHistoryState(nextHistory);
  }, [commitData, historyEnabled]);

  const redo = useCallback(() => {
    if (!historyEnabled) {
      return;
    }

    const currentHistory = historyStateRef.current;
    const entry = currentHistory.future[0];

    if (!entry) {
      return;
    }

    if (!commitData(entry.redo, { trackHistory: false })) {
      return;
    }

    const nextHistory = {
      past: [...currentHistory.past, entry],
      future: currentHistory.future.slice(1),
    };

    historyStateRef.current = nextHistory;
    setHistoryState(nextHistory);
  }, [commitData, historyEnabled]);

  const resetHistory = useCallback(() => {
    const nextHistory = createBuilderHistoryState();
    historyStateRef.current = nextHistory;
    setHistoryState(nextHistory);
  }, []);

  const setHistory = useCallback((nextHistory: IBuilderHistoryState) => {
    const resolvedHistory = clone(nextHistory);
    historyStateRef.current = resolvedHistory;
    setHistoryState(resolvedHistory);
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
    setHistory,
    showHistoryControls,
    undo,
  };
};
