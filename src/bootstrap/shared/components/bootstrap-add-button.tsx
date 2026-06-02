import React, { FC } from 'react';
import { IButtonProps } from '../../../button';
import { resolveButtonContent } from './button-utils';
import { joinClassNames } from './styles';

export const BootstrapAddButton: FC<IButtonProps> = props => (
  <button
    type="button"
    onClick={props.onClick}
    disabled={props.disabled}
    className={joinClassNames('btn btn-primary btn-sm', props.className)}
    title={props.title}
    data-test={props['data-test']}
  >
    {resolveButtonContent(props)}
  </button>
);
