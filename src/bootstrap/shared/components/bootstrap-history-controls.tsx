import React, { FC } from 'react';
import { IHistoryControlsProps } from '../../../builder';
import { joinClassNames } from './styles';

export const BootstrapHistoryControls: FC<IHistoryControlsProps> = ({
  undoButton,
  redoButton,
  className,
}) => (
  <div className={joinClassNames('btn-group btn-group-sm', className)} role="group">
    {undoButton}
    {redoButton}
  </div>
);
