import React from 'react';
import { NormalizedQuery } from './query-tree';

export const applyDataUpdate = (
  data: NormalizedQuery,
  setData: React.Dispatch<NormalizedQuery>,
  onChange: (data: NormalizedQuery) => void,
  updater: (currentData: NormalizedQuery) => NormalizedQuery,
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void
) => {
  if (updateData) {
    updateData(updater);
    return;
  }

  const nextData = updater(data);

  setData(nextData);
  onChange(nextData);
};
