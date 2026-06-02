import React, { FC } from 'react';
import { IButtonProps } from '../../../button';
import { resolveButtonContent } from './button-utils';
import { joinClassNames } from './styles';

export const BootstrapRemoveButton: FC<IButtonProps> = props => (
  <button
    type="button"
    onClick={props.onClick}
    disabled={props.disabled}
    className={joinClassNames('btn btn-outline-danger btn-sm', props.className)}
    title={props.title}
    data-test={props['data-test']}
  >
    {resolveButtonContent(props)}
  </button>
);
