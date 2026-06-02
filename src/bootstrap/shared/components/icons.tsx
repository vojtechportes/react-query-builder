import React, { FC } from 'react';
import { BuilderLockState } from '../../../builder';

const BootstrapIcon: FC<{ className: string }> = ({ className }) => (
  <i className={className} aria-hidden="true" />
);

export const BootstrapCodeIcon: FC = () => (
  <BootstrapIcon className="bi bi-code-slash" />
);

export const BootstrapBuilderIcon: FC = () => (
  <BootstrapIcon className="bi bi-ui-checks-grid" />
);

export const BootstrapCheckIcon: FC = () => (
  <BootstrapIcon className="bi bi-check2" />
);

export const BootstrapCopyIcon: FC = () => (
  <BootstrapIcon className="bi bi-copy" />
);

export const BootstrapChevronDownIcon: FC = () => (
  <BootstrapIcon className="bi bi-chevron-down" />
);

export const BootstrapLockIcon: FC<{ state: BuilderLockState }> = ({ state }) => {
  if (state === 'unlocked') {
    return <BootstrapIcon className="bi bi-unlock" />;
  }

  if (state === 'self') {
    return <BootstrapIcon className="bi bi-lock" />;
  }

  return <BootstrapIcon className="bi bi-lock-fill" />;
};
