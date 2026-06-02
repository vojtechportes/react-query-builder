import React, { FC } from 'react';
import { ITextModeToggleContentProps } from '../../../builder';
import { BootstrapBuilderIcon, BootstrapCodeIcon } from './icons';

export const BootstrapTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <span className="d-inline-flex align-items-center gap-2 lh-1">
    {mode === 'text' ? <BootstrapBuilderIcon /> : <BootstrapCodeIcon />}
    <span>{label}</span>
  </span>
);
