import React, { FC } from 'react';
import { ITextModeInputProps } from '../../../builder';
import { joinClassNames } from './styles';

export const BootstrapTextModeInput: FC<ITextModeInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
  readOnly = false,
  spellCheck = false,
  inputDataTest,
}) => (
  <div className={joinClassNames('border rounded bg-body', className)}>
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      disabled={disabled}
      readOnly={readOnly}
      spellCheck={spellCheck}
      className={joinClassNames(
        'form-control rounded-0 border-0 font-monospace',
        inputClassName
      )}
      data-test={inputDataTest}
      style={{ minHeight: '10rem', resize: 'vertical' }}
    />
  </div>
);
