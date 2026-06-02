import React, { FC } from 'react';
import { ICloneButtonProps } from '../../../clone-button';
import { getCloneButtonTitle } from '../../../utils/get-clone-button-title.util';
import { BootstrapCopyIcon } from './icons';
import {
  bootstrapIconButtonContentStyles,
  bootstrapIconButtonStyles,
  joinClassNames,
} from './styles';

export const BootstrapCloneButton: FC<ICloneButtonProps> = ({
  nodeType,
  disabled = false,
  onClick,
  className,
  title,
  'data-test': dataTest,
}) => {
  const resolvedTitle = title || getCloneButtonTitle(undefined, nodeType);

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
      disabled={disabled}
      className={joinClassNames('btn btn-outline-secondary btn-sm', className)}
      style={bootstrapIconButtonStyles}
      title={resolvedTitle}
      aria-label={resolvedTitle}
      data-test={dataTest}
    >
      <span
        className="d-inline-flex align-items-center justify-content-center"
        style={bootstrapIconButtonContentStyles}
      >
        <BootstrapCopyIcon />
      </span>
    </button>
  );
};
