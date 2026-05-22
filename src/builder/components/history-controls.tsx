import React, { FC } from 'react';
import styled from 'styled-components';
import { IHistoryControlsProps } from '../types';

const HistoryControlsRoot = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  gap: 0.5rem;
`;

export const HistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <HistoryControlsRoot className={className}>
    {undoButton}
    {redoButton}
  </HistoryControlsRoot>
);
