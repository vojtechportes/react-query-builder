import { IBuilderHistoryState } from './types';

export const createBuilderHistoryState = (): IBuilderHistoryState => ({
  past: [],
  future: [],
});
