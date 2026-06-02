import React, { FC } from 'react';
import { joinClassNames } from './styles';

export interface IBootstrapTextProps {
  children?: React.ReactNode;
  className?: string;
}

export const BootstrapText: FC<IBootstrapTextProps> = ({
  children,
  className,
}) => (
  <span
    className={joinClassNames(
      'd-inline-flex align-items-center px-2 py-1 border rounded bg-body',
      className
    )}
    style={{ minWidth: '160px', minHeight: '2rem' }}
  >
    {children}
  </span>
);
