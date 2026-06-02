import React, { FC } from 'react';
import { IPopoverItemProps } from '../../../popover-item';
import { joinClassNames } from './styles';

export const BootstrapPopoverItem: FC<IPopoverItemProps> = ({
  label,
  onClick,
  className,
  'data-test': dataTest,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={joinClassNames('dropdown-item', className)}
    data-test={dataTest}
  >
    {label}
  </button>
);
